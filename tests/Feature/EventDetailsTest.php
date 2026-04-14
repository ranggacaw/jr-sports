<?php

namespace Tests\Feature;

use App\Models\SportsEvent;
use App\Models\User;
use App\Models\Venue;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class EventDetailsTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_view_an_upcoming_event_details_page(): void
    {
        $viewer = User::factory()->create(['name' => 'Alex Viewer']);
        $participant = User::factory()->create(['name' => 'Jordan Player']);
        $event = SportsEvent::factory()
            ->for(Venue::factory()->state([
                'name' => 'Arena Court',
                'address' => 'Jl. Gatot Subroto No. 5',
                'city' => 'Jakarta',
                'google_maps_url' => 'https://maps.google.com/?q=Arena+Court+Jakarta',
            ]))
            ->create([
                'name' => 'Morning Badminton',
                'recurrence' => 'Weekly',
            ]);

        $event->registrations()->createMany([
            ['user_id' => $viewer->id],
            ['user_id' => $participant->id],
        ]);

        $this->actingAs($viewer)
            ->get(route('events.show', $event))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Events/Show')
                ->where('event.name', 'Morning Badminton')
                ->where('event.recurrence', 'Weekly')
                ->where('event.registration_is_open', true)
                ->where('event.is_registered', true)
                ->where('event.participants_count', 2)
                ->where('event.venue.name', 'Arena Court')
                ->where('event.venue.city', 'Jakarta')
                ->where('event.participants', fn ($participants) => collect($participants)->pluck('name')->all() === ['Alex Viewer', 'Jordan Player'])
            );
    }

    public function test_guests_are_redirected_to_login_when_opening_event_details(): void
    {
        $event = SportsEvent::factory()->create();

        $this->get(route('events.show', $event))
            ->assertRedirect(route('login'));
    }

    public function test_event_details_only_show_registered_participants(): void
    {
        $viewer = User::factory()->create();
        $participant = User::factory()->create(['name' => 'Rina Athlete']);
        $outsider = User::factory()->create(['name' => 'Chris Observer']);
        $event = SportsEvent::factory()->create();

        $event->registrations()->create([
            'user_id' => $participant->id,
        ]);

        $this->actingAs($viewer)
            ->get(route('events.show', $event))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Events/Show')
                ->where('event.participants_count', 1)
                ->where('event.participants', fn ($participants) => collect($participants)->values()->all() === [[
                    'id' => $participant->id,
                    'name' => 'Rina Athlete',
                ]] && ! collect($participants)->pluck('name')->contains($outsider->name))
            );
    }
}
