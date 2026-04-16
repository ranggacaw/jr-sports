<?php

namespace App\Services\Tournaments;

use App\Models\Tournament;
use App\Models\TournamentMatch;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class RecordMatchScore
{
    public function __construct(
        private readonly RefreshGroupStandings $refreshGroupStandings,
        private readonly SeedBracket $seedBracket,
    ) {}

    /**
     * @throws ValidationException
     */
    public function handle(TournamentMatch $match, array $scores): TournamentMatch
    {
        $g1_p1 = $scores['g1_p1_score'] ?? 0;
        $g1_p2 = $scores['g1_p2_score'] ?? 0;
        $g2_p1 = $scores['g2_p1_score'] ?? 0;
        $g2_p2 = $scores['g2_p2_score'] ?? 0;
        $g3_p1 = $scores['g3_p1_score'] ?? null;
        $g3_p2 = $scores['g3_p2_score'] ?? null;

        $p1Sets = 0;
        $p2Sets = 0;

        if ($g1_p1 > $g1_p2) $p1Sets++;
        elseif ($g1_p2 > $g1_p1) $p2Sets++;

        if ($g2_p1 > $g2_p2) $p1Sets++;
        elseif ($g2_p2 > $g2_p1) $p2Sets++;

        if ($g3_p1 !== null && $g3_p2 !== null) {
            if ($g3_p1 > $g3_p2) $p1Sets++;
            elseif ($g3_p2 > $g3_p1) $p2Sets++;
        }

        $playerOneScore = $p1Sets;
        $playerTwoScore = $p2Sets;

        if ($playerOneScore === $playerTwoScore) {
            throw ValidationException::withMessages([
                'score' => 'Matches cannot end in a tie. Please record the sets accurately.',
            ]);
        }

        return DB::transaction(function () use ($match, $playerOneScore, $playerTwoScore, $g1_p1, $g1_p2, $g2_p1, $g2_p2, $g3_p1, $g3_p2) {
            $lockedMatch = TournamentMatch::query()
                ->with('tournament')
                ->lockForUpdate()
                ->findOrFail($match->id);

            if (! $lockedMatch->hasParticipants()) {
                throw ValidationException::withMessages([
                    'score' => 'Both participants must be assigned before scoring a match.',
                ]);
            }

            if ($lockedMatch->status === TournamentMatch::STATUS_COMPLETED) {
                if ($lockedMatch->player_one_score === $playerOneScore && $lockedMatch->player_two_score === $playerTwoScore) {
                    return $lockedMatch;
                }

                throw ValidationException::withMessages([
                    'score' => 'This match has already been scored.',
                ]);
            }

            $winnerRegistrationId = $playerOneScore > $playerTwoScore
                ? $lockedMatch->player_one_registration_id
                : $lockedMatch->player_two_registration_id;

            $loserRegistrationId = $winnerRegistrationId === $lockedMatch->player_one_registration_id
                ? $lockedMatch->player_two_registration_id
                : $lockedMatch->player_one_registration_id;

            $lockedMatch->update([
                'player_one_score' => $playerOneScore,
                'player_two_score' => $playerTwoScore,
                'g1_p1_score' => $g1_p1,
                'g1_p2_score' => $g1_p2,
                'g2_p1_score' => $g2_p1,
                'g2_p2_score' => $g2_p2,
                'g3_p1_score' => $g3_p1,
                'g3_p2_score' => $g3_p2,
                'winner_registration_id' => $winnerRegistrationId,
                'loser_registration_id' => $loserRegistrationId,
                'status' => TournamentMatch::STATUS_COMPLETED,
                'completed_at' => now(),
            ]);

            if ($lockedMatch->stage === TournamentMatch::STAGE_GROUP) {
                $this->refreshGroupStandings->handle($lockedMatch->tournament);

                $remainingGroupMatches = $lockedMatch->tournament->matches()
                    ->where('stage', TournamentMatch::STAGE_GROUP)
                    ->where('status', '!=', TournamentMatch::STATUS_COMPLETED)
                    ->count();

                if ($remainingGroupMatches === 0) {
                    $this->seedBracket->handle($lockedMatch->tournament);
                }

                return $lockedMatch->fresh();
            }

            $this->advanceParticipant($lockedMatch->tournament_id, $lockedMatch->winner_to_match_code, $lockedMatch->winner_to_slot, $winnerRegistrationId);
            $this->advanceParticipant($lockedMatch->tournament_id, $lockedMatch->loser_to_match_code, $lockedMatch->loser_to_slot, $loserRegistrationId);

            if ($lockedMatch->stage === TournamentMatch::STAGE_FINAL) {
                $lockedMatch->tournament()->update([
                    'state' => Tournament::STATE_COMPLETED,
                    'champion_registration_id' => $winnerRegistrationId,
                ]);
            }

            return $lockedMatch->fresh();
        });
    }

    private function advanceParticipant(int $tournamentId, ?string $targetMatchCode, ?int $slot, ?int $registrationId): void
    {
        if (! $targetMatchCode || ! $slot || ! $registrationId) {
            return;
        }

        $targetMatch = TournamentMatch::query()
            ->where('tournament_id', $tournamentId)
            ->where('code', $targetMatchCode)
            ->lockForUpdate()
            ->first();

        if (! $targetMatch) {
            return;
        }

        $column = $slot === 1 ? 'player_one_registration_id' : 'player_two_registration_id';

        if ($targetMatch->{$column} !== null && $targetMatch->{$column} !== $registrationId) {
            throw ValidationException::withMessages([
                'score' => sprintf('Unable to place a participant into %s because the slot is already occupied.', $targetMatchCode),
            ]);
        }

        $targetMatch->update([
            $column => $registrationId,
        ]);
    }
}
