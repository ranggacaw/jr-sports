<?php

namespace Database\Factories;

use App\Models\GroupStanding;
use App\Models\Registration;
use App\Models\SportsEvent;
use App\Models\Tournament;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<GroupStanding>
 */
class GroupStandingFactory extends Factory
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
            'registration_id' => Registration::factory(),
            'group_name' => fake()->randomElement(['A', 'B', 'C', 'D']),
            'wins' => 0,
            'losses' => 0,
            'points' => 0,
            'points_for' => 0,
            'points_against' => 0,
            'point_differential' => 0,
            'rank' => null,
        ];
    }
}
