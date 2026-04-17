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
            'format' => Tournament::FORMAT_SINGLES,
            'entrant_count' => 16,
            'entrants' => [],
            'reserve_registration_ids' => [],
            'champion_registration_id' => null,
        ];
    }
}
