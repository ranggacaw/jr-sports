<?php

namespace Database\Factories;

use App\Models\SportsEvent;
use App\Models\Venue;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SportsEvent>
 */
class SportsEventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startsAt = fake()->dateTimeBetween('+1 day', '+2 months');

        return [
            'venue_id' => Venue::factory(),
            'name' => fake()->randomElement(['Futsal Session', 'Badminton Night', 'Basketball Pickup', 'Volleyball Drill']),
            'recurrence' => fake()->randomElement(['One-time', 'Daily', 'Weekly']),
            'starts_at' => $startsAt,
            'ends_at' => (clone $startsAt)->modify('+2 hours'),
            'registration_closed_at' => null,
        ];
    }

    public function closed(): static
    {
        return $this->state(fn (array $attributes) => [
            'registration_closed_at' => now(),
        ]);
    }
}
