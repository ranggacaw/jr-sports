<?php

namespace Tests\Feature;

use App\Models\SportsEvent;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class EventListingTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_listing_shows_upcoming_events_with_venue_details_and_maps_links(): void
    {
        SportsEvent::factory()->create([
            'name' => 'Morning Badminton',
            'recurrence' => 'Weekly',
        ]);

        $response = $this->get('/');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Events/Index')
            ->has('events', 1)
            ->where('events.0.name', 'Morning Badminton')
            ->where('events.0.recurrence', 'Weekly')
            ->where('events.0.registration_is_open', true)
            ->where('events.0.venue.google_maps_url', fn (?string $url) => filled($url))
        );
    }
}
