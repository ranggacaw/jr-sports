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
     * @param  array<string, mixed>  $configuration
     *
     * @throws ValidationException
     */
    public function handle(SportsEvent $sportsEvent, array $configuration): Tournament
    {
        return DB::transaction(function () use ($sportsEvent, $configuration) {
            $lockedEvent = SportsEvent::query()
                ->with(['registrations.user' => fn ($query) => $query->orderBy('users.name')])
                ->lockForUpdate()
                ->findOrFail($sportsEvent->id);

            if ($lockedEvent->tournament()->exists()) {
                throw ValidationException::withMessages([
                    'tournament' => 'This event already has an active tournament.',
                ]);
            }

            $format = $configuration['format'] ?? Tournament::FORMAT_SINGLES;
            $entrantCount = (int) ($configuration['entrant_count'] ?? 0);

            if (! in_array($format, [Tournament::FORMAT_SINGLES, Tournament::FORMAT_DOUBLES], true)) {
                throw ValidationException::withMessages([
                    'format' => 'The selected tournament format is invalid.',
                ]);
            }


            $registrationLookup = $lockedEvent->registrations->keyBy('id');
            $reserveIds = $this->validatedReserveIds($configuration['reserve_registration_ids'] ?? [], $registrationLookup);
            $entrants = $format === Tournament::FORMAT_SINGLES
                ? $this->buildSinglesEntrants($configuration, $entrantCount, $registrationLookup, $reserveIds)
                : $this->buildDoublesEntrants($configuration, $entrantCount, $registrationLookup, $reserveIds);

            if ($lockedEvent->registration_closed_at === null) {
                $lockedEvent->update([
                    'registration_closed_at' => now(),
                ]);
            }

            $tournament = $lockedEvent->tournament()->create([
                'state' => Tournament::STATE_GROUP_STAGE,
                'format' => $format,
                'entrant_count' => $entrantCount,
                'entrants' => $entrants->values()->all(),
                'reserve_registration_ids' => $reserveIds,
            ]);

            $groupedEntrants = $entrants->values()->splitIn(2);
            $groupNames = range('A', 'Z');

            foreach ($groupedEntrants as $groupIndex => $groupEntrants) {
                $groupName = $groupNames[$groupIndex];

                foreach ($groupEntrants as $entrant) {
                    $tournament->groupStandings()->create([
                        'sports_event_id' => $lockedEvent->id,
                        'registration_id' => $entrant['registration_id'],
                        'group_name' => $groupName,
                    ]);
                }

                foreach ($this->roundRobinPairs($groupEntrants) as $matchIndex => $pair) {
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
     * @param  Collection<int, Registration>  $registrationLookup
     * @return array<int, int>
     */
    private function validatedReserveIds(mixed $rawReserveIds, Collection $registrationLookup): array
    {
        $reserveIds = collect($rawReserveIds)
            ->map(fn ($registrationId) => (int) $registrationId)
            ->filter(fn (int $registrationId) => $registrationId > 0)
            ->values();

        if ($reserveIds->duplicates()->isNotEmpty()) {
            throw ValidationException::withMessages([
                'reserve_registration_ids' => 'Reserve players must be unique.',
            ]);
        }

        $invalidIds = $reserveIds->reject(fn (int $registrationId) => $registrationLookup->has($registrationId));

        if ($invalidIds->isNotEmpty()) {
            throw ValidationException::withMessages([
                'reserve_registration_ids' => 'Reserve players must come from the event registration list.',
            ]);
        }

        return $reserveIds->all();
    }

    /**
     * @param  array<string, mixed>  $configuration
     * @param  Collection<int, Registration>  $registrationLookup
     * @param  array<int, int>  $reserveIds
     * @return Collection<int, array{registration_id:int, team_name:null, member_registration_ids:array<int, int>}>
     */
    private function buildSinglesEntrants(array $configuration, int $entrantCount, Collection $registrationLookup, array $reserveIds): Collection
    {
        $activeIds = collect($configuration['active_registration_ids'] ?? [])
            ->map(fn ($registrationId) => (int) $registrationId)
            ->filter(fn (int $registrationId) => $registrationId > 0)
            ->values();

        if ($activeIds->count() !== $entrantCount) {
            throw ValidationException::withMessages([
                'active_registration_ids' => sprintf('Select exactly %d active singles entrants.', $entrantCount),
            ]);
        }

        if ($activeIds->duplicates()->isNotEmpty()) {
            throw ValidationException::withMessages([
                'active_registration_ids' => 'Active singles entrants must be unique.',
            ]);
        }

        $invalidIds = $activeIds->reject(fn (int $registrationId) => $registrationLookup->has($registrationId));

        if ($invalidIds->isNotEmpty()) {
            throw ValidationException::withMessages([
                'active_registration_ids' => 'All active entrants must come from the event registration list.',
            ]);
        }

        if ($activeIds->intersect($reserveIds)->isNotEmpty()) {
            throw ValidationException::withMessages([
                'reserve_registration_ids' => 'Reserve players cannot also be active entrants.',
            ]);
        }

        return $activeIds->map(fn (int $registrationId) => [
            'registration_id' => $registrationId,
            'team_name' => null,
            'member_registration_ids' => [$registrationId],
        ]);
    }

    /**
     * @param  array<string, mixed>  $configuration
     * @param  Collection<int, Registration>  $registrationLookup
     * @param  array<int, int>  $reserveIds
     * @return Collection<int, array{registration_id:int, team_name:string, member_registration_ids:array<int, int>}>
     */
    private function buildDoublesEntrants(array $configuration, int $entrantCount, Collection $registrationLookup, array $reserveIds): Collection
    {
        $teams = collect($configuration['teams'] ?? [])->values();

        if ($teams->count() !== $entrantCount) {
            throw ValidationException::withMessages([
                'teams' => sprintf('Create exactly %d active doubles teams.', $entrantCount),
            ]);
        }

        $assignedMemberIds = collect();

        $entrants = $teams->map(function ($team, int $index) use ($registrationLookup, $assignedMemberIds) {
            $teamName = trim((string) ($team['name'] ?? ''));

            if ($teamName === '') {
                throw ValidationException::withMessages([
                    "teams.$index.name" => 'Each doubles team needs a team name.',
                ]);
            }

            $memberIds = collect($team['member_registration_ids'] ?? [])
                ->map(fn ($registrationId) => (int) $registrationId)
                ->filter(fn (int $registrationId) => $registrationId > 0)
                ->values();

            if ($memberIds->count() !== 2) {
                throw ValidationException::withMessages([
                    "teams.$index.member_registration_ids" => 'Each doubles team must include exactly two registered players.',
                ]);
            }

            if ($memberIds->duplicates()->isNotEmpty()) {
                throw ValidationException::withMessages([
                    "teams.$index.member_registration_ids" => 'A doubles team cannot assign the same player twice.',
                ]);
            }

            $invalidIds = $memberIds->reject(fn (int $registrationId) => $registrationLookup->has($registrationId));

            if ($invalidIds->isNotEmpty()) {
                throw ValidationException::withMessages([
                    "teams.$index.member_registration_ids" => 'Doubles teams can only use confirmed event registrations.',
                ]);
            }

            $duplicateIds = $memberIds->intersect($assignedMemberIds);

            if ($duplicateIds->isNotEmpty()) {
                throw ValidationException::withMessages([
                    "teams.$index.member_registration_ids" => 'Players can only be assigned to one active doubles team.',
                ]);
            }

            $assignedMemberIds->push(...$memberIds->all());

            return [
                'registration_id' => $memberIds->first(),
                'team_name' => $teamName,
                'member_registration_ids' => $memberIds->all(),
            ];
        });

        if ($assignedMemberIds->intersect($reserveIds)->isNotEmpty()) {
            throw ValidationException::withMessages([
                'reserve_registration_ids' => 'Reserve players cannot also be assigned to an active doubles team.',
            ]);
        }

        return $entrants;
    }

    /**
     * @param  Collection<int, array{registration_id:int}>  $entrants
     * @return array<int, array{0: int, 1: int}>
     */
    private function roundRobinPairs(Collection $entrants): array
    {
        $pairs = [];
        $registrationIds = $entrants->pluck('registration_id')->values();

        foreach ($registrationIds as $leftIndex => $leftRegistrationId) {
            for ($rightIndex = $leftIndex + 1; $rightIndex < $registrationIds->count(); $rightIndex++) {
                $pairs[] = [$leftRegistrationId, $registrationIds[$rightIndex]];
            }
        }

        return $pairs;
    }
}
