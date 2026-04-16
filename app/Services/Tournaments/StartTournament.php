<?php

namespace App\Services\Tournaments;

use App\Models\Registration;
use App\Models\SportsEvent;
use App\Models\Tournament;
use App\Models\TournamentMatch;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class StartTournament
{
    /**
     * @throws ValidationException
     */
    public function handle(SportsEvent $sportsEvent): Tournament
    {
        return DB::transaction(function () use ($sportsEvent) {
            $lockedEvent = SportsEvent::query()
                ->with(['registrations' => fn ($query) => $query->orderBy('registrations.id')])
                ->lockForUpdate()
                ->findOrFail($sportsEvent->id);

            if ($lockedEvent->tournament()->exists()) {
                throw ValidationException::withMessages([
                    'tournament' => 'This event already has an active tournament.',
                ]);
            }

            if ($lockedEvent->registrations->count() !== 16) {
                throw ValidationException::withMessages([
                    'tournament' => 'Exactly 16 registered players are required to start a tournament.',
                ]);
            }

            if ($lockedEvent->registration_closed_at === null) {
                $lockedEvent->update([
                    'registration_closed_at' => now(),
                ]);
            }

            $tournament = $lockedEvent->tournament()->create([
                'state' => Tournament::STATE_GROUP_STAGE,
            ]);

            $groupNames = ['A', 'B', 'C', 'D'];
            $groupedRegistrations = $lockedEvent->registrations->values()->chunk(4);

            foreach ($groupedRegistrations as $groupIndex => $groupRegistrations) {
                $groupName = $groupNames[$groupIndex];

                foreach ($groupRegistrations as $registration) {
                    $tournament->groupStandings()->create([
                        'sports_event_id' => $lockedEvent->id,
                        'registration_id' => $registration->id,
                        'group_name' => $groupName,
                    ]);
                }

                foreach ($this->roundRobinPairs($groupRegistrations) as $matchIndex => $pair) {
                    $tournament->matches()->create([
                        'sports_event_id' => $lockedEvent->id,
                        'code' => sprintf('G%s%d', $groupName, $matchIndex + 1),
                        'stage' => TournamentMatch::STAGE_GROUP,
                        'status' => TournamentMatch::STATUS_SCHEDULED,
                        'group_name' => $groupName,
                        'round_name' => sprintf('Group %s', $groupName),
                        'sort_order' => ($groupIndex * 10) + $matchIndex + 1,
                        'player_one_registration_id' => $pair[0],
                        'player_two_registration_id' => $pair[1],
                    ]);
                }
            }

            return $tournament->fresh(['matches', 'groupStandings']);
        });
    }

    /**
     * @param  Collection<int, Registration>  $registrations
     * @return array<int, array{0: int, 1: int}>
     */
    private function roundRobinPairs(Collection $registrations): array
    {
        $pairs = [];
        $registrationIds = $registrations->pluck('id')->values();

        foreach ($registrationIds as $leftIndex => $leftRegistrationId) {
            for ($rightIndex = $leftIndex + 1; $rightIndex < $registrationIds->count(); $rightIndex++) {
                $pairs[] = [$leftRegistrationId, $registrationIds[$rightIndex]];
            }
        }

        return $pairs;
    }
}
