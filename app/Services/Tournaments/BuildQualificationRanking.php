<?php

namespace App\Services\Tournaments;

use App\Models\GroupStanding;
use App\Models\Tournament;
use App\Models\TournamentMatch;
use Illuminate\Support\Collection;

class BuildQualificationRanking
{
    /**
     * @return Collection<int, array<string, int|string|null>>
     */
    public function handle(Tournament $tournament): Collection
    {
        $tournament->loadMissing('groupStandings.registration.user');

        $standings = $tournament->groupStandings
            ->sort(fn (GroupStanding $left, GroupStanding $right) => $this->compareStandings($left, $right))
            ->values();

        return $standings->map(function (GroupStanding $standing, int $index) {
            $qualificationRank = $index + 1;
            $isUpperBracket = $qualificationRank <= 8;

            return [
                'registration_id' => $standing->registration_id,
                'player_name' => $standing->registration?->user?->name,
                'group_name' => $standing->group_name,
                'group_rank' => $standing->rank,
                'points' => $standing->points,
                'point_differential' => $standing->point_differential,
                'qualification_rank' => $qualificationRank,
                'bracket' => $isUpperBracket ? 'upper' : 'lower',
                'bracket_label' => $isUpperBracket ? 'Upper Bracket' : 'Lower Bracket',
            ];
        });
    }

    public function isFinalized(Tournament $tournament): bool
    {
        if ($tournament->state !== Tournament::STATE_GROUP_STAGE) {
            return true;
        }

        $groupMatches = $tournament->relationLoaded('matches')
            ? $tournament->matches->where('stage', TournamentMatch::STAGE_GROUP)
            : $tournament->matches()->where('stage', TournamentMatch::STAGE_GROUP)->get();

        return $groupMatches->isNotEmpty()
            && $groupMatches->every(fn (TournamentMatch $match) => $match->status === TournamentMatch::STATUS_COMPLETED);
    }

    private function compareStandings(GroupStanding $left, GroupStanding $right): int
    {
        if ($left->points !== $right->points) {
            return $right->points <=> $left->points;
        }

        if ($left->point_differential !== $right->point_differential) {
            return $right->point_differential <=> $left->point_differential;
        }

        if (($left->rank ?? PHP_INT_MAX) !== ($right->rank ?? PHP_INT_MAX)) {
            return ($left->rank ?? PHP_INT_MAX) <=> ($right->rank ?? PHP_INT_MAX);
        }

        if ($this->coinFlipValue($left) !== $this->coinFlipValue($right)) {
            return $this->coinFlipValue($left) <=> $this->coinFlipValue($right);
        }

        return $left->registration_id <=> $right->registration_id;
    }

    private function coinFlipValue(GroupStanding $standing): int
    {
        return (int) sprintf('%u', crc32(sprintf('%s:%s', $standing->tournament_id, $standing->registration_id)));
    }
}
