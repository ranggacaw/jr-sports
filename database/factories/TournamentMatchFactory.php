<?php

namespace Database\Factories;

use App\Models\SportsEvent;
use App\Models\Tournament;
use App\Models\TournamentMatch;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TournamentMatch>
 */
class TournamentMatchFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'tournament_id' => Tournament::factory(),
            'sports_event_id' => SportsEvent::factory(),
            'code' => strtoupper(fake()->bothify('M##')),
            'stage' => TournamentMatch::STAGE_GROUP,
            'status' => TournamentMatch::STATUS_SCHEDULED,
            'bracket' => null,
            'round_name' => 'Round 1',
            'group_name' => 'A',
            'sort_order' => 1,
            'player_one_registration_id' => null,
            'player_two_registration_id' => null,
            'player_one_score' => null,
            'player_two_score' => null,
            'winner_registration_id' => null,
            'loser_registration_id' => null,
            'winner_to_match_code' => null,
            'winner_to_slot' => null,
            'loser_to_match_code' => null,
            'loser_to_slot' => null,
            'completed_at' => null,
        ];
    }
}
