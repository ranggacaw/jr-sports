<?php

namespace Database\Factories;

use App\Models\Venue;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Venue>
 */
class VenueFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->company().' Sports Hall',
            'address' => fake()->streetAddress(),
            'city' => fake()->city(),
            'google_maps_url' => 'https://maps.google.com/?q='.urlencode(fake()->streetAddress().' '.fake()->city()),
        ];
    }
}
