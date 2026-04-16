<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SportsEvent;
use App\Models\Tournament;
use App\Models\TournamentMatch;
use App\Models\Venue;
use App\Services\Tournaments\BuildQualificationRanking;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function __construct(
        private readonly BuildQualificationRanking $buildQualificationRanking,
    ) {}

    public function index(): Response
    {
        return Inertia::render('Admin/Events/Index', [
            'events' => SportsEvent::query()
                ->with([
                    'venue',
                    'participants',
                    'tournament.groupStandings.registration.user',
                    'tournament.matches.playerOneRegistration.user',
                    'tournament.matches.playerTwoRegistration.user',
                    'tournament.championRegistration.user',
                ])
                ->withCount('participants')
                ->orderBy('starts_at')
                ->get()
                ->map(fn (SportsEvent $event) => $this->eventListPayload($event)),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Events/Form', [
            'event' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $payload = $this->validatedPayload($request);

        $venue = Venue::create($payload['venue']);

        SportsEvent::create([
            ...$payload['event'],
            'venue_id' => $venue->id,
        ]);

        return redirect()->route('admin.events.index')
            ->with('success', 'Event created successfully.');
    }

    public function show(SportsEvent $sportsEvent): Response
    {
        $sportsEvent->load([
            'venue',
            'participants',
            'tournament.groupStandings.registration.user',
            'tournament.matches.playerOneRegistration.user',
            'tournament.matches.playerTwoRegistration.user',
            'tournament.championRegistration.user',
        ])->loadCount('participants');

        return Inertia::render('Admin/Events/Show', [
            'event' => $this->eventListPayload($sportsEvent),
        ]);
    }

    public function edit(SportsEvent $sportsEvent): Response
    {
        $sportsEvent->load('venue');

        return Inertia::render('Admin/Events/Form', [
            'event' => [
                'id' => $sportsEvent->id,
                'name' => $sportsEvent->name,
                'recurrence' => $sportsEvent->recurrence,
                'starts_at' => $sportsEvent->starts_at?->format('Y-m-d\TH:i'),
                'ends_at' => $sportsEvent->ends_at?->format('Y-m-d\TH:i'),
                'registration_closed_at' => $sportsEvent->registration_closed_at?->toIso8601String(),
                'venue' => [
                    'name' => $sportsEvent->venue->name,
                    'address' => $sportsEvent->venue->address,
                    'city' => $sportsEvent->venue->city,
                    'google_maps_url' => $sportsEvent->venue->google_maps_url,
                ],
            ],
        ]);
    }

    public function update(Request $request, SportsEvent $sportsEvent): RedirectResponse
    {
        $payload = $this->validatedPayload($request);

        $sportsEvent->venue->update($payload['venue']);
        $sportsEvent->update($payload['event']);

        return redirect()->route('admin.events.index')
            ->with('success', 'Event updated successfully.');
    }

    public function closeRegistration(SportsEvent $sportsEvent): RedirectResponse
    {
        if ($sportsEvent->registration_closed_at === null) {
            $sportsEvent->update([
                'registration_closed_at' => now(),
            ]);
        }

        return back()->with('success', 'Registration has been closed for this event.');
    }

    private function validatedPayload(Request $request): array
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'recurrence' => ['required', 'string', 'max:50'],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'venue.name' => ['required', 'string', 'max:255'],
            'venue.address' => ['required', 'string', 'max:255'],
            'venue.city' => ['required', 'string', 'max:255'],
            'venue.google_maps_url' => ['nullable', 'url', 'max:255'],
        ]);

        return [
            'event' => [
                'name' => $validated['name'],
                'recurrence' => $validated['recurrence'],
                'starts_at' => $validated['starts_at'],
                'ends_at' => $validated['ends_at'] ?? null,
            ],
            'venue' => $validated['venue'],
        ];
    }

    private function eventListPayload(SportsEvent $event): array
    {
        return [
            'id' => $event->id,
            'name' => $event->name,
            'recurrence' => $event->recurrence,
            'starts_at' => $event->starts_at?->toIso8601String(),
            'ends_at' => $event->ends_at?->toIso8601String(),
            'registration_is_open' => $event->registrationIsOpen(),
            'participants_count' => $event->participants_count,
            'can_start_tournament' => ! $event->relationLoaded('tournament') || $event->tournament === null
                ? $event->participants_count === 16
                : false,
            'participants' => $event->relationLoaded('participants') ? $event->participants->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'email' => $p->email,
            ])->toArray() : [],
            'tournament' => $event->relationLoaded('tournament') && $event->tournament !== null
                ? $this->tournamentPayload($event->tournament)
                : null,
            'venue' => [
                'name' => $event->venue->name,
                'address' => $event->venue->address,
                'city' => $event->venue->city,
            ],
        ];
    }

    private function tournamentPayload(Tournament $tournament): array
    {
        $pendingMatches = $tournament->matches
            ->filter(fn (TournamentMatch $match) => $match->status === TournamentMatch::STATUS_SCHEDULED && $match->hasParticipants())
            ->sortBy('sort_order')
            ->values();
        $qualification = $this->buildQualificationRanking->isFinalized($tournament)
            ? $this->buildQualificationRanking->handle($tournament)
            : collect();
        $qualificationByRegistration = $qualification->keyBy('registration_id');

        return [
            'id' => $tournament->id,
            'state' => $tournament->state,
            'champion_name' => $tournament->championRegistration?->user?->name,
            'pending_matches' => $pendingMatches->map(fn (TournamentMatch $match) => [
                'id' => $match->id,
                'code' => $match->code,
                'stage' => $match->stage,
                'round_name' => $match->round_name,
                'group_name' => $match->group_name,
                'player_one_name' => $match->playerOneRegistration?->user?->name ?? 'TBD',
                'player_two_name' => $match->playerTwoRegistration?->user?->name ?? 'TBD',
            ])->all(),
            'groups' => $tournament->groupStandings
                ->sortBy(['group_name', 'rank', 'registration_id'])
                ->groupBy('group_name')
                ->map(fn ($standings, $groupName) => [
                    'name' => $groupName,
                    'entries' => $standings->map(fn ($standing) => [
                        'registration_id' => $standing->registration_id,
                        'player_name' => $standing->registration?->user?->name,
                        'rank' => $standing->rank,
                        'points' => $standing->points,
                        'point_differential' => $standing->point_differential,
                        'qualification_rank' => $qualificationByRegistration->get($standing->registration_id)['qualification_rank'] ?? null,
                        'bracket' => $qualificationByRegistration->get($standing->registration_id)['bracket'] ?? null,
                        'bracket_label' => $qualificationByRegistration->get($standing->registration_id)['bracket_label'] ?? null,
                    ])->values()->all(),
                ])
                ->values()
                ->all(),
            'qualification' => $qualification->values()->all(),
            'brackets' => [
                'upper' => $tournament->matches
                    ->where('stage', TournamentMatch::STAGE_UPPER)
                    ->values()
                    ->map(fn (TournamentMatch $match) => $this->matchPayload($match))
                    ->all(),
                'lower' => $tournament->matches
                    ->where('stage', TournamentMatch::STAGE_LOWER)
                    ->values()
                    ->map(fn (TournamentMatch $match) => $this->matchPayload($match))
                    ->all(),
                'grand_final' => $tournament->matches
                    ->where('stage', TournamentMatch::STAGE_FINAL)
                    ->values()
                    ->map(fn (TournamentMatch $match) => $this->matchPayload($match))
                    ->all(),
            ],
        ];
    }

    private function matchPayload(TournamentMatch $match): array
    {
        return [
            'id' => $match->id,
            'code' => $match->code,
            'stage' => $match->stage,
            'status' => $match->status,
            'round_name' => $match->round_name,
            'group_name' => $match->group_name,
            'player_one_name' => $match->playerOneRegistration?->user?->name ?? 'TBD',
            'player_two_name' => $match->playerTwoRegistration?->user?->name ?? 'TBD',
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
}
