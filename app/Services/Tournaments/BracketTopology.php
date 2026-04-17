<?php

namespace App\Services\Tournaments;

use App\Models\TournamentMatch;

class BracketTopology
{
    /**
     * @return array<int, array<string, int|string|null>>
     */
    public static function matchesForEntrantCount(int $entrantCount): array
    {
        return match ($entrantCount) {
            4 => self::fourEntrantMatches(),
            8 => self::eightEntrantMatches(),
            16 => self::sixteenEntrantMatches(),
            default => [],
        };
    }

    /**
     * @return array{upper: array<int, string>, lower: array<int, string>}
     */
    public static function initialMatchCodesForEntrantCount(int $entrantCount): array
    {
        return match ($entrantCount) {
            4 => ['upper' => ['U1'], 'lower' => ['L1']],
            8 => ['upper' => ['U1', 'U2'], 'lower' => ['L1', 'L2']],
            16 => ['upper' => ['U1', 'U2', 'U3', 'U4'], 'lower' => ['L1', 'L2', 'L3', 'L4']],
            default => ['upper' => [], 'lower' => []],
        };
    }

    /**
     * @return array<int, array<string, int|string|null>>
     */
    private static function fourEntrantMatches(): array
    {
        return [
            ['code' => 'U1', 'stage' => TournamentMatch::STAGE_UPPER, 'bracket' => 'upper', 'round_name' => 'Upper Final', 'sort_order' => 101, 'winner_to_match_code' => 'G1', 'winner_to_slot' => 1, 'loser_to_match_code' => 'L2', 'loser_to_slot' => 1],
            ['code' => 'L1', 'stage' => TournamentMatch::STAGE_LOWER, 'bracket' => 'lower', 'round_name' => 'Lower Round 1', 'sort_order' => 201, 'winner_to_match_code' => 'L2', 'winner_to_slot' => 2, 'loser_to_match_code' => null, 'loser_to_slot' => null],
            ['code' => 'L2', 'stage' => TournamentMatch::STAGE_LOWER, 'bracket' => 'lower', 'round_name' => 'Lower Final', 'sort_order' => 202, 'winner_to_match_code' => 'G1', 'winner_to_slot' => 2, 'loser_to_match_code' => null, 'loser_to_slot' => null],
            ['code' => 'G1', 'stage' => TournamentMatch::STAGE_FINAL, 'bracket' => 'grand_final', 'round_name' => 'Grand Final', 'sort_order' => 301, 'winner_to_match_code' => null, 'winner_to_slot' => null, 'loser_to_match_code' => null, 'loser_to_slot' => null],
        ];
    }

    /**
     * @return array<int, array<string, int|string|null>>
     */
    private static function eightEntrantMatches(): array
    {
        return [
            ['code' => 'U1', 'stage' => TournamentMatch::STAGE_UPPER, 'bracket' => 'upper', 'round_name' => 'Upper Round 1', 'sort_order' => 101, 'winner_to_match_code' => 'U3', 'winner_to_slot' => 1, 'loser_to_match_code' => 'L3', 'loser_to_slot' => 1],
            ['code' => 'U2', 'stage' => TournamentMatch::STAGE_UPPER, 'bracket' => 'upper', 'round_name' => 'Upper Round 1', 'sort_order' => 102, 'winner_to_match_code' => 'U3', 'winner_to_slot' => 2, 'loser_to_match_code' => 'L4', 'loser_to_slot' => 1],
            ['code' => 'U3', 'stage' => TournamentMatch::STAGE_UPPER, 'bracket' => 'upper', 'round_name' => 'Upper Final', 'sort_order' => 103, 'winner_to_match_code' => 'G1', 'winner_to_slot' => 1, 'loser_to_match_code' => 'L6', 'loser_to_slot' => 1],
            ['code' => 'L1', 'stage' => TournamentMatch::STAGE_LOWER, 'bracket' => 'lower', 'round_name' => 'Lower Round 1', 'sort_order' => 201, 'winner_to_match_code' => 'L3', 'winner_to_slot' => 2, 'loser_to_match_code' => null, 'loser_to_slot' => null],
            ['code' => 'L2', 'stage' => TournamentMatch::STAGE_LOWER, 'bracket' => 'lower', 'round_name' => 'Lower Round 1', 'sort_order' => 202, 'winner_to_match_code' => 'L4', 'winner_to_slot' => 2, 'loser_to_match_code' => null, 'loser_to_slot' => null],
            ['code' => 'L3', 'stage' => TournamentMatch::STAGE_LOWER, 'bracket' => 'lower', 'round_name' => 'Lower Round 2', 'sort_order' => 203, 'winner_to_match_code' => 'L5', 'winner_to_slot' => 1, 'loser_to_match_code' => null, 'loser_to_slot' => null],
            ['code' => 'L4', 'stage' => TournamentMatch::STAGE_LOWER, 'bracket' => 'lower', 'round_name' => 'Lower Round 2', 'sort_order' => 204, 'winner_to_match_code' => 'L5', 'winner_to_slot' => 2, 'loser_to_match_code' => null, 'loser_to_slot' => null],
            ['code' => 'L5', 'stage' => TournamentMatch::STAGE_LOWER, 'bracket' => 'lower', 'round_name' => 'Lower Semifinal', 'sort_order' => 205, 'winner_to_match_code' => 'L6', 'winner_to_slot' => 2, 'loser_to_match_code' => null, 'loser_to_slot' => null],
            ['code' => 'L6', 'stage' => TournamentMatch::STAGE_LOWER, 'bracket' => 'lower', 'round_name' => 'Lower Final', 'sort_order' => 206, 'winner_to_match_code' => 'G1', 'winner_to_slot' => 2, 'loser_to_match_code' => null, 'loser_to_slot' => null],
            ['code' => 'G1', 'stage' => TournamentMatch::STAGE_FINAL, 'bracket' => 'grand_final', 'round_name' => 'Grand Final', 'sort_order' => 301, 'winner_to_match_code' => null, 'winner_to_slot' => null, 'loser_to_match_code' => null, 'loser_to_slot' => null],
        ];
    }

    /**
     * @return array<int, array<string, int|string|null>>
     */
    private static function sixteenEntrantMatches(): array
    {
        return [
            ['code' => 'U1', 'stage' => TournamentMatch::STAGE_UPPER, 'bracket' => 'upper', 'round_name' => 'Upper Round 1', 'sort_order' => 101, 'winner_to_match_code' => 'U5', 'winner_to_slot' => 1, 'loser_to_match_code' => 'L5', 'loser_to_slot' => 1],
            ['code' => 'U2', 'stage' => TournamentMatch::STAGE_UPPER, 'bracket' => 'upper', 'round_name' => 'Upper Round 1', 'sort_order' => 102, 'winner_to_match_code' => 'U5', 'winner_to_slot' => 2, 'loser_to_match_code' => 'L6', 'loser_to_slot' => 1],
            ['code' => 'U3', 'stage' => TournamentMatch::STAGE_UPPER, 'bracket' => 'upper', 'round_name' => 'Upper Round 1', 'sort_order' => 103, 'winner_to_match_code' => 'U6', 'winner_to_slot' => 1, 'loser_to_match_code' => 'L7', 'loser_to_slot' => 1],
            ['code' => 'U4', 'stage' => TournamentMatch::STAGE_UPPER, 'bracket' => 'upper', 'round_name' => 'Upper Round 1', 'sort_order' => 104, 'winner_to_match_code' => 'U6', 'winner_to_slot' => 2, 'loser_to_match_code' => 'L8', 'loser_to_slot' => 1],
            ['code' => 'U5', 'stage' => TournamentMatch::STAGE_UPPER, 'bracket' => 'upper', 'round_name' => 'Upper Semifinal', 'sort_order' => 105, 'winner_to_match_code' => 'U7', 'winner_to_slot' => 1, 'loser_to_match_code' => 'L11', 'loser_to_slot' => 1],
            ['code' => 'U6', 'stage' => TournamentMatch::STAGE_UPPER, 'bracket' => 'upper', 'round_name' => 'Upper Semifinal', 'sort_order' => 106, 'winner_to_match_code' => 'U7', 'winner_to_slot' => 2, 'loser_to_match_code' => 'L12', 'loser_to_slot' => 1],
            ['code' => 'U7', 'stage' => TournamentMatch::STAGE_UPPER, 'bracket' => 'upper', 'round_name' => 'Upper Final', 'sort_order' => 107, 'winner_to_match_code' => 'G1', 'winner_to_slot' => 1, 'loser_to_match_code' => 'L14', 'loser_to_slot' => 1],
            ['code' => 'L1', 'stage' => TournamentMatch::STAGE_LOWER, 'bracket' => 'lower', 'round_name' => 'Lower Round 1', 'sort_order' => 201, 'winner_to_match_code' => 'L5', 'winner_to_slot' => 2, 'loser_to_match_code' => null, 'loser_to_slot' => null],
            ['code' => 'L2', 'stage' => TournamentMatch::STAGE_LOWER, 'bracket' => 'lower', 'round_name' => 'Lower Round 1', 'sort_order' => 202, 'winner_to_match_code' => 'L6', 'winner_to_slot' => 2, 'loser_to_match_code' => null, 'loser_to_slot' => null],
            ['code' => 'L3', 'stage' => TournamentMatch::STAGE_LOWER, 'bracket' => 'lower', 'round_name' => 'Lower Round 1', 'sort_order' => 203, 'winner_to_match_code' => 'L7', 'winner_to_slot' => 2, 'loser_to_match_code' => null, 'loser_to_slot' => null],
            ['code' => 'L4', 'stage' => TournamentMatch::STAGE_LOWER, 'bracket' => 'lower', 'round_name' => 'Lower Round 1', 'sort_order' => 204, 'winner_to_match_code' => 'L8', 'winner_to_slot' => 2, 'loser_to_match_code' => null, 'loser_to_slot' => null],
            ['code' => 'L5', 'stage' => TournamentMatch::STAGE_LOWER, 'bracket' => 'lower', 'round_name' => 'Lower Round 2', 'sort_order' => 205, 'winner_to_match_code' => 'L9', 'winner_to_slot' => 1, 'loser_to_match_code' => null, 'loser_to_slot' => null],
            ['code' => 'L6', 'stage' => TournamentMatch::STAGE_LOWER, 'bracket' => 'lower', 'round_name' => 'Lower Round 2', 'sort_order' => 206, 'winner_to_match_code' => 'L9', 'winner_to_slot' => 2, 'loser_to_match_code' => null, 'loser_to_slot' => null],
            ['code' => 'L7', 'stage' => TournamentMatch::STAGE_LOWER, 'bracket' => 'lower', 'round_name' => 'Lower Round 2', 'sort_order' => 207, 'winner_to_match_code' => 'L10', 'winner_to_slot' => 1, 'loser_to_match_code' => null, 'loser_to_slot' => null],
            ['code' => 'L8', 'stage' => TournamentMatch::STAGE_LOWER, 'bracket' => 'lower', 'round_name' => 'Lower Round 2', 'sort_order' => 208, 'winner_to_match_code' => 'L10', 'winner_to_slot' => 2, 'loser_to_match_code' => null, 'loser_to_slot' => null],
            ['code' => 'L9', 'stage' => TournamentMatch::STAGE_LOWER, 'bracket' => 'lower', 'round_name' => 'Lower Round 3', 'sort_order' => 209, 'winner_to_match_code' => 'L11', 'winner_to_slot' => 2, 'loser_to_match_code' => null, 'loser_to_slot' => null],
            ['code' => 'L10', 'stage' => TournamentMatch::STAGE_LOWER, 'bracket' => 'lower', 'round_name' => 'Lower Round 3', 'sort_order' => 210, 'winner_to_match_code' => 'L12', 'winner_to_slot' => 2, 'loser_to_match_code' => null, 'loser_to_slot' => null],
            ['code' => 'L11', 'stage' => TournamentMatch::STAGE_LOWER, 'bracket' => 'lower', 'round_name' => 'Lower Round 4', 'sort_order' => 211, 'winner_to_match_code' => 'L13', 'winner_to_slot' => 1, 'loser_to_match_code' => null, 'loser_to_slot' => null],
            ['code' => 'L12', 'stage' => TournamentMatch::STAGE_LOWER, 'bracket' => 'lower', 'round_name' => 'Lower Round 4', 'sort_order' => 212, 'winner_to_match_code' => 'L13', 'winner_to_slot' => 2, 'loser_to_match_code' => null, 'loser_to_slot' => null],
            ['code' => 'L13', 'stage' => TournamentMatch::STAGE_LOWER, 'bracket' => 'lower', 'round_name' => 'Lower Semifinal', 'sort_order' => 213, 'winner_to_match_code' => 'L14', 'winner_to_slot' => 1, 'loser_to_match_code' => null, 'loser_to_slot' => null],
            ['code' => 'L14', 'stage' => TournamentMatch::STAGE_LOWER, 'bracket' => 'lower', 'round_name' => 'Lower Final', 'sort_order' => 214, 'winner_to_match_code' => 'G1', 'winner_to_slot' => 2, 'loser_to_match_code' => null, 'loser_to_slot' => null],
            ['code' => 'G1', 'stage' => TournamentMatch::STAGE_FINAL, 'bracket' => 'grand_final', 'round_name' => 'Grand Final', 'sort_order' => 301, 'winner_to_match_code' => null, 'winner_to_slot' => null, 'loser_to_match_code' => null, 'loser_to_slot' => null],
        ];
    }
}
