<?php

namespace Tests\Feature;

use App\Models\Registration;
use App\Models\SportsEvent;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EventRegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_register_for_an_open_event_once(): void
    {
        $user = User::factory()->create();
        $event = SportsEvent::factory()->create();

        $response = $this->actingAs($user)->post(route('events.registrations.store', $event));

        $response->assertRedirect();
        $this->assertDatabaseHas('registrations', [
            'sports_event_id' => $event->id,
            'user_id' => $user->id,
        ]);

        $duplicateResponse = $this->actingAs($user)->from('/')->post(route('events.registrations.store', $event));

        $duplicateResponse->assertRedirect('/');
        $duplicateResponse->assertSessionHasErrors('registration');
        $this->assertSame(1, Registration::query()->count());
    }

    public function test_user_cannot_register_for_a_closed_event(): void
    {
        $user = User::factory()->create();
        $event = SportsEvent::factory()->closed()->create();

        $response = $this->actingAs($user)->from('/')->post(route('events.registrations.store', $event));

        $response->assertRedirect('/');
        $response->assertSessionHasErrors('registration');
        $this->assertDatabaseMissing('registrations', [
            'sports_event_id' => $event->id,
            'user_id' => $user->id,
        ]);
    }
}
