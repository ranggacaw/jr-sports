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

            $qualification = $this->buildQualificationRanking->handle($lockedTournament)
                ->keyBy('qualification_rank');

            $initialAssignments = [
                'U1' => [$this->registrationIdFor($qualification, 1), $this->registrationIdFor($qualification, 8)],
                'U2' => [$this->registrationIdFor($qualification, 4), $this->registrationIdFor($qualification, 5)],
                'U3' => [$this->registrationIdFor($qualification, 2), $this->registrationIdFor($qualification, 7)],
                'U4' => [$this->registrationIdFor($qualification, 3), $this->registrationIdFor($qualification, 6)],
                'L1' => [$this->registrationIdFor($qualification, 9), $this->registrationIdFor($qualification, 16)],
                'L2' => [$this->registrationIdFor($qualification, 12), $this->registrationIdFor($qualification, 13)],
                'L3' => [$this->registrationIdFor($qualification, 10), $this->registrationIdFor($qualification, 15)],
                'L4' => [$this->registrationIdFor($qualification, 11), $this->registrationIdFor($qualification, 14)],
            ];

            foreach (BracketTopology::matches() as $config) {
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
