<?php

namespace Database\Factories;

use App\Models\Registration;
use App\Models\SportsEvent;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Registration>
 */
class RegistrationFactory extends Factory
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
            'user_id' => User::factory(),
        ];
    }
}
