<?php

namespace App\Services\Tournaments;

use App\Models\GroupStanding;
use App\Models\Tournament;
use App\Models\TournamentMatch;
use Illuminate\Support\Collection;

class RefreshGroupStandings
{
    public function handle(Tournament $tournament): void
    {
        $standings = $tournament->groupStandings()
            ->get()
            ->keyBy('registration_id');

        $completedMatches = $tournament->matches()
            ->where('stage', TournamentMatch::STAGE_GROUP)
            ->where('status', TournamentMatch::STATUS_COMPLETED)
            ->get();

        foreach ($standings as $standing) {
            $standing->wins = 0;
            $standing->losses = 0;
            $standing->points = 0;
            $standing->points_for = 0;
            $standing->points_against = 0;
            $standing->point_differential = 0;
            $standing->rank = null;
        }

        foreach ($completedMatches as $match) {
            $playerOne = $standings->get($match->player_one_registration_id);
            $playerTwo = $standings->get($match->player_two_registration_id);

            if (! $playerOne || ! $playerTwo) {
                continue;
            }

            $playerOne->points_for += $match->player_one_score;
            $playerOne->points_against += $match->player_two_score;
            $playerTwo->points_for += $match->player_two_score;
            $playerTwo->points_against += $match->player_one_score;

            if ($match->winner_registration_id === $playerOne->registration_id) {
                $playerOne->wins++;
                $playerOne->points += 3;
                $playerTwo->losses++;
            } else {
                $playerTwo->wins++;
                $playerTwo->points += 3;
                $playerOne->losses++;
            }
        }

        foreach ($standings as $standing) {
            $standing->point_differential = $standing->points_for - $standing->points_against;
        }

        $matchesByGroup = $completedMatches->groupBy('group_name');

        foreach ($standings->groupBy('group_name') as $groupStandings) {
            $ordered = $groupStandings->sort(function (GroupStanding $left, GroupStanding $right) use ($matchesByGroup) {
                return $this->compareStandings($left, $right, $matchesByGroup->get($left->group_name, collect()));
            })->values();

            foreach ($ordered as $index => $standing) {
                $standing->rank = $index + 1;
            }
        }

        $standings->each->save();
    }

    private function compareStandings(GroupStanding $left, GroupStanding $right, Collection $groupMatches): int
    {
        if ($left->points !== $right->points) {
            return $right->points <=> $left->points;
        }

        if ($left->point_differential !== $right->point_differential) {
            return $right->point_differential <=> $left->point_differential;
        }

        $headToHeadWinnerId = $this->headToHeadWinnerId($groupMatches, $left->registration_id, $right->registration_id);

        if ($headToHeadWinnerId === $left->registration_id) {
            return -1;
        }

        if ($headToHeadWinnerId === $right->registration_id) {
            return 1;
        }

        return $this->coinFlipValue($left) <=> $this->coinFlipValue($right);
    }

    private function headToHeadWinnerId(Collection $groupMatches, int $leftRegistrationId, int $rightRegistrationId): ?int
    {
        $match = $groupMatches->first(function (TournamentMatch $match) use ($leftRegistrationId, $rightRegistrationId) {
            return collect([
                $match->player_one_registration_id,
                $match->player_two_registration_id,
            ])->sort()->values()->all() === collect([$leftRegistrationId, $rightRegistrationId])->sort()->values()->all();
        });

        return $match?->winner_registration_id;
    }

    private function coinFlipValue(GroupStanding $standing): int
    {
        return (int) sprintf('%u', crc32(sprintf('%s:%s', $standing->tournament_id, $standing->registration_id)));
    }
}
