<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use App\Models\SportsEvent;
use App\Models\Tournament;
use App\Models\TournamentMatch;
use App\Services\Tournaments\BuildQualificationRanking;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function __construct(
        private readonly BuildQualificationRanking $buildQualificationRanking,
    ) {}

    public function index(Request $request): Response
    {
        $userId = $request->user()?->id;

        $events = SportsEvent::query()
            ->with(['venue', 'tournament.championRegistration.user'])
            ->withCount('participants')
            ->orderByDesc('starts_at');

        if ($userId) {
            $events->with(['participants:id,name']);
        }

        return Inertia::render('Events/Index', [
            'events' => $events
                ->get()
                ->map(fn (SportsEvent $event) => $this->eventPayload($event, $userId, $userId !== null)),
        ]);
    }

    public function dashboard(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Dashboard', [
            'registeredEvents' => $user->sportsEvents()
                ->with('venue')
                ->where('starts_at', '>=', now()->startOfDay())
                ->orderBy('starts_at')
                ->get()
                ->map(fn (SportsEvent $event) => $this->eventPayload($event->loadMissing('participants:id,name'), $user->id)),
        ]);
    }

    public function show(Request $request, SportsEvent $sportsEvent): Response
    {
        $sportsEvent->load([
            'venue',
            'registrations.user',
            'participants' => fn ($query) => $query
                ->select('users.id', 'users.name')
                ->orderBy('users.name'),
            'tournament.groupStandings.registration.user',
            'tournament.matches.playerOneRegistration.user',
            'tournament.matches.playerTwoRegistration.user',
        ])->loadCount('participants');

        return Inertia::render('Events/Show', [
            'event' => $this->eventPayload($sportsEvent, $request->user()->id),
        ]);
    }

    private function eventPayload(SportsEvent $event, ?int $userId, bool $includeParticipants = true): array
    {
        $participants = $event->relationLoaded('participants') ? $event->participants : collect();
        $registrations = $event->relationLoaded('registrations') ? $event->registrations : collect();
        $viewerRegistrationId = $userId
            ? $registrations->firstWhere('user_id', $userId)?->id
            : null;

        return [
            'id' => $event->id,
            'name' => $event->name,
            'banner_url' => $event->banner_url,
            'recurrence' => $event->recurrence,
            'starts_at' => $event->starts_at?->toIso8601String(),
            'ends_at' => $event->ends_at?->toIso8601String(),
            'registration_closed_at' => $event->registration_closed_at?->toIso8601String(),
            'registration_is_open' => $event->registrationIsOpen(),
            'participants_count' => $event->participants_count ?? $event->participants()->count(),
            'is_registered' => $userId
                ? $participants->contains('id', $userId)
                : false,
            'participants' => $includeParticipants
                ? $participants
                    ->map(fn ($participant) => [
                        'id' => $participant->id,
                        'name' => $participant->name,
                    ])
                    ->values()
                    ->all()
                : [],
            'venue' => [
                'name' => $event->venue->name,
                'address' => $event->venue->address,
                'city' => $event->venue->city,
                'google_maps_url' => $event->venue->google_maps_url,
            ],
            'champion_name' => $event->relationLoaded('tournament') && $event->tournament?->championRegistration
                ? $event->tournament->championRegistration->user->name
                : null,
            'tournament' => $event->relationLoaded('tournament') && $event->tournament !== null && $event->tournament->relationLoaded('matches')
                ? $this->tournamentPayload($event, $event->tournament, $viewerRegistrationId)
                : null,
        ];
    }

    private function tournamentPayload(SportsEvent $event, Tournament $tournament, ?int $viewerRegistrationId): array
    {
        $matches = $tournament->matches->sortBy('sort_order')->values();
        $qualification = $this->buildQualificationRanking->isFinalized($tournament)
            ? $this->buildQualificationRanking->handle($tournament)
            : collect();
        $qualificationByRegistration = $qualification->keyBy('registration_id');
        $registrationLookup = $event->registrations->keyBy('id');
        $entrantLookup = $this->entrantLookup($tournament, $registrationLookup);
        $presentedQualification = $qualification->map(function (array $entry) use ($entrantLookup) {
            $entrant = $entrantLookup->get($entry['registration_id'], $this->fallbackEntrant($entry['registration_id']));

            return [
                ...$entry,
                'player_name' => $entrant['label'],
                'member_names' => $entrant['member_names'],
            ];
        })->values();
        $viewerEntrantIds = $viewerRegistrationId === null
            ? []
            : $tournament->entrantDefinitions()
                ->filter(fn (array $entrant) => in_array($viewerRegistrationId, $entrant['member_registration_ids'], true))
                ->pluck('registration_id')
                ->values()
                ->all();

        return [
            'id' => $tournament->id,
            'state' => $tournament->state,
            'format' => $tournament->format ?: Tournament::FORMAT_SINGLES,
            'format_label' => ($tournament->format ?: Tournament::FORMAT_SINGLES) === Tournament::FORMAT_DOUBLES ? 'Doubles' : 'Singles',
            'entrant_count' => $tournament->entrant_count ?: 16,
            'reserves' => collect($tournament->reserveIds())
                ->map(fn (int $registrationId) => $registrationLookup->get($registrationId))
                ->filter()
                ->map(fn (Registration $registration) => [
                    'registration_id' => $registration->id,
                    'name' => $registration->user?->name,
                ])->values()->all(),
            'groups' => $tournament->groupStandings
                ->sortBy(['group_name', 'rank', 'registration_id'])
                ->groupBy('group_name')
                ->map(fn (Collection $standings, string $groupName) => [
                    'name' => $groupName,
                    'entries' => $standings->map(function ($standing) use ($qualificationByRegistration, $entrantLookup) {
                        $entrant = $entrantLookup->get($standing->registration_id, $this->fallbackEntrant($standing->registration_id));

                        return [
                            'registration_id' => $standing->registration_id,
                            'player_name' => $entrant['label'],
                            'member_names' => $entrant['member_names'],
                            'wins' => $standing->wins,
                            'losses' => $standing->losses,
                            'points' => $standing->points,
                            'point_differential' => $standing->point_differential,
                            'rank' => $standing->rank,
                            'qualification_rank' => $qualificationByRegistration->get($standing->registration_id)['qualification_rank'] ?? null,
                            'bracket' => $qualificationByRegistration->get($standing->registration_id)['bracket'] ?? null,
                            'bracket_label' => $qualificationByRegistration->get($standing->registration_id)['bracket_label'] ?? null,
                        ];
                    })->values()->all(),
                ])
                ->values()
                ->all(),
            'qualification' => $presentedQualification->all(),
            'my_qualification' => empty($viewerEntrantIds)
                ? null
                : $presentedQualification->first(fn (array $entry) => in_array($entry['registration_id'], $viewerEntrantIds, true)),
            'brackets' => [
                'upper' => $matches
                    ->where('stage', TournamentMatch::STAGE_UPPER)
                    ->values()
                    ->map(fn (TournamentMatch $match) => $this->matchPayload($match, $entrantLookup))
                    ->all(),
                'lower' => $matches
                    ->where('stage', TournamentMatch::STAGE_LOWER)
                    ->values()
                    ->map(fn (TournamentMatch $match) => $this->matchPayload($match, $entrantLookup))
                    ->all(),
                'grand_final' => $matches
                    ->where('stage', TournamentMatch::STAGE_FINAL)
                    ->values()
                    ->map(fn (TournamentMatch $match) => $this->matchPayload($match, $entrantLookup))
                    ->all(),
            ],
            'my_matches' => empty($viewerEntrantIds)
                ? []
                : $matches
                    ->filter(fn (TournamentMatch $match) => in_array($match->player_one_registration_id, $viewerEntrantIds, true)
                        || in_array($match->player_two_registration_id, $viewerEntrantIds, true))
                    ->values()
                    ->map(fn (TournamentMatch $match) => $this->matchPayload($match, $entrantLookup))
                    ->all(),
        ];
    }

    /**
     * @param  Collection<int, Registration>  $registrationLookup
     * @return Collection<int, array{label:string, member_names:array<int, string>}>
     */
    private function entrantLookup(Tournament $tournament, Collection $registrationLookup): Collection
    {
        return $tournament->entrantDefinitions()
            ->map(function (array $entrant) use ($registrationLookup) {
                $memberNames = collect($entrant['member_registration_ids'])
                    ->map(fn (int $registrationId) => $registrationLookup->get($registrationId)?->user?->name)
                    ->filter()
                    ->values()
                    ->all();

                return [
                    'registration_id' => $entrant['registration_id'],
                    'label' => $entrant['team_name'] ?: ($memberNames[0] ?? 'Unknown Player'),
                    'member_names' => $memberNames,
                ];
            })
            ->keyBy('registration_id');
    }

    /**
     * @param  Collection<int, array{label:string, member_names:array<int, string>}>  $entrantLookup
     */
    private function matchPayload(TournamentMatch $match, Collection $entrantLookup): array
    {
        $playerOne = $entrantLookup->get($match->player_one_registration_id, $this->fallbackEntrant($match->player_one_registration_id));
        $playerTwo = $entrantLookup->get($match->player_two_registration_id, $this->fallbackEntrant($match->player_two_registration_id));

        return [
            'id' => $match->id,
            'code' => $match->code,
            'stage' => $match->stage,
            'status' => $match->status,
            'round_name' => $match->round_name,
            'group_name' => $match->group_name,
            'player_one_name' => $playerOne['label'],
            'player_one_members' => $playerOne['member_names'],
            'player_two_name' => $playerTwo['label'],
            'player_two_members' => $playerTwo['member_names'],
            'player_one_score' => $match->player_one_score,
            'player_two_score' => $match->player_two_score,
            'g1_p1_score' => $match->g1_p1_score,
            'g1_p2_score' => $match->g1_p2_score,
            'g2_p1_score' => $match->g2_p1_score,
            'g2_p2_score' => $match->g2_p2_score,
            'g3_p1_score' => $match->g3_p1_score,
            'g3_p2_score' => $match->g3_p2_score,
            'winner_registration_id' => $match->winner_registration_id,
        ];
    }

    /**
     * @return array{label:string, member_names:array<int, string>}
     */
    private function fallbackEntrant(?int $registrationId): array
    {
        return [
            'label' => $registrationId === null ? 'TBD' : 'Unknown Entrant',
            'member_names' => [],
        ];
    }
}
