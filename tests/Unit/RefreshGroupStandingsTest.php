<?php

namespace Tests\Unit;

use App\Models\GroupStanding;
use App\Models\Registration;
use App\Models\SportsEvent;
use App\Models\Tournament;
use App\Models\TournamentMatch;
use App\Services\Tournaments\RefreshGroupStandings;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RefreshGroupStandingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_orders_ties_by_point_differential_then_head_to_head(): void
    {
        $event = SportsEvent::factory()->create();
        $tournament = Tournament::factory()->create([
            'sports_event_id' => $event->id,
            'state' => Tournament::STATE_GROUP_STAGE,
        ]);

        $registrations = Registration::factory()->count(4)->create([
            'sports_event_id' => $event->id,
        ])->values();

        foreach ($registrations as $registration) {
            GroupStanding::factory()->create([
                'tournament_id' => $tournament->id,
                'sports_event_id' => $event->id,
                'registration_id' => $registration->id,
                'group_name' => 'A',
            ]);
        }

        $matches = [
            [$registrations[0], $registrations[1], 21, 19],
            [$registrations[0], $registrations[2], 21, 16],
            [$registrations[3], $registrations[0], 21, 20],
            [$registrations[1], $registrations[2], 21, 19],
            [$registrations[1], $registrations[3], 21, 17],
            [$registrations[2], $registrations[3], 21, 19],
        ];

        foreach ($matches as $index => [$playerOne, $playerTwo, $playerOneScore, $playerTwoScore]) {
            TournamentMatch::factory()->create([
                'tournament_id' => $tournament->id,
                'sports_event_id' => $event->id,
                'code' => 'A'.($index + 1),
                'stage' => TournamentMatch::STAGE_GROUP,
                'group_name' => 'A',
                'player_one_registration_id' => $playerOne->id,
                'player_two_registration_id' => $playerTwo->id,
                'player_one_score' => $playerOneScore,
                'player_two_score' => $playerTwoScore,
                'winner_registration_id' => $playerOneScore > $playerTwoScore ? $playerOne->id : $playerTwo->id,
                'loser_registration_id' => $playerOneScore > $playerTwoScore ? $playerTwo->id : $playerOne->id,
                'status' => TournamentMatch::STATUS_COMPLETED,
            ]);
        }

        app(RefreshGroupStandings::class)->handle($tournament);

        $orderedRegistrationIds = $tournament->groupStandings()
            ->orderBy('rank')
            ->pluck('registration_id')
            ->all();

        $this->assertSame([
            $registrations[0]->id,
            $registrations[1]->id,
            $registrations[2]->id,
            $registrations[3]->id,
        ], $orderedRegistrationIds);
    }
}
