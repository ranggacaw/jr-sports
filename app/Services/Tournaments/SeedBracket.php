<?php

namespace App\Services\Tournaments;

use App\Models\Tournament;
use App\Models\TournamentMatch;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SeedBracket
{
    public function __construct(
        private readonly BuildQualificationRanking $buildQualificationRanking,
    ) {}

    /**
     * @throws ValidationException
     */
    public function handle(Tournament $tournament): void
    {
        DB::transaction(function () use ($tournament) {
            $lockedTournament = Tournament::query()
                ->with(['groupStandings', 'matches'])
                ->lockForUpdate()
                ->findOrFail($tournament->id);

            if ($lockedTournament->state !== Tournament::STATE_GROUP_STAGE) {
                return;
            }

            if ($lockedTournament->matches->contains(fn (TournamentMatch $match) => $match->stage === TournamentMatch::STAGE_GROUP && $match->status !== TournamentMatch::STATUS_COMPLETED)) {
                throw ValidationException::withMessages([
                    'tournament' => 'All group stage matches must be completed before bracket seeding.',
                ]);
            }

            if ($lockedTournament->matches->contains(fn (TournamentMatch $match) => $match->stage !== TournamentMatch::STAGE_GROUP)) {
                return;
            }

            $entrantCount = $lockedTournament->entrant_count ?: 16;
            $qualification = $this->buildQualificationRanking->handle($lockedTournament)
                ->keyBy('qualification_rank');
            $initialAssignments = $this->initialAssignments($qualification, $entrantCount);

            foreach (BracketTopology::matchesForEntrantCount($entrantCount) as $config) {
                [$playerOneRegistrationId, $playerTwoRegistrationId] = $initialAssignments[$config['code']] ?? [null, null];

                $lockedTournament->matches()->create([
                    'sports_event_id' => $lockedTournament->sports_event_id,
                    'code' => $config['code'],
                    'stage' => $config['stage'],
                    'status' => TournamentMatch::STATUS_SCHEDULED,
                    'bracket' => $config['bracket'],
                    'round_name' => $config['round_name'],
                    'group_name' => null,
                    'sort_order' => $config['sort_order'],
                    'player_one_registration_id' => $playerOneRegistrationId,
                    'player_two_registration_id' => $playerTwoRegistrationId,
                    'winner_to_match_code' => $config['winner_to_match_code'],
                    'winner_to_slot' => $config['winner_to_slot'],
                    'loser_to_match_code' => $config['loser_to_match_code'],
                    'loser_to_slot' => $config['loser_to_slot'],
                ]);
            }

            $lockedTournament->update([
                'state' => Tournament::STATE_BRACKET_STAGE,
            ]);
        });
    }

    /**
     * @param  Collection<int, array<string, int|string|null>>  $qualification
     * @return array<string, array{0: int|null, 1: int|null}>
     */
    private function initialAssignments(Collection $qualification, int $entrantCount): array
    {
        $half = (int) ($entrantCount / 2);
        $pairings = $this->pairingsForBracketSize($half);
        $matchCodes = BracketTopology::initialMatchCodesForEntrantCount($entrantCount);
        $assignments = [];

        foreach ($matchCodes['upper'] as $index => $code) {
            [$seedOne, $seedTwo] = $pairings[$index];

            $assignments[$code] = [
                $this->registrationIdFor($qualification, $seedOne),
                $this->registrationIdFor($qualification, $seedTwo),
            ];
        }

        foreach ($matchCodes['lower'] as $index => $code) {
            [$seedOne, $seedTwo] = $pairings[$index];

            $assignments[$code] = [
                $this->registrationIdFor($qualification, $half + $seedOne),
                $this->registrationIdFor($qualification, $half + $seedTwo),
            ];
        }

        return $assignments;
    }

    /**
     * @return array<int, array{0: int, 1: int}>
     */
    private function pairingsForBracketSize(int $bracketSize): array
    {
        return match ($bracketSize) {
            2 => [[1, 2]],
            4 => [[1, 4], [2, 3]],
            8 => [[1, 8], [4, 5], [2, 7], [3, 6]],
            default => [],
        };
    }

    /**
     * @param  Collection<int, array<string, int|string|null>>  $qualification
     */
    private function registrationIdFor(Collection $qualification, int $rank): int
    {
        $standing = $qualification->get($rank);

        if (! $standing) {
            throw ValidationException::withMessages([
                'tournament' => sprintf('Unable to find qualification rank %d for bracket seeding.', $rank),
            ]);
        }

        return $standing['registration_id'];
    }
}
