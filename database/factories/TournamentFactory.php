<?php

namespace Database\Factories;

use App\Models\SportsEvent;
use App\Models\Tournament;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Tournament>
 */
class TournamentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'sports_event_id' => SportsEvent::factory(),
            'state' => Tournament::STATE_PENDING,
            'champion_registration_id' => null,
        ];
    }
}
