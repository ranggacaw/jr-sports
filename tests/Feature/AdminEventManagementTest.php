<?php

namespace Tests\Feature;

use App\Models\SportsEvent;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminEventManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_only_admins_can_access_the_admin_event_management_screen(): void
    {
        $user = User::factory()->create();

        $this->get(route('admin.events.index'))->assertRedirect(route('login'));

        $this->actingAs($user)
            ->get(route('admin.events.index'))
            ->assertForbidden();
    }

    public function test_admin_can_create_events_and_close_registration(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->post(route('admin.events.store'), [
            'name' => 'Basketball Scrimmage',
            'recurrence' => 'Weekly',
            'starts_at' => now()->addWeek()->format('Y-m-d H:i:s'),
            'ends_at' => now()->addWeek()->addHours(2)->format('Y-m-d H:i:s'),
            'venue' => [
                'name' => 'Arena Court',
                'address' => 'Jl. Gatot Subroto No. 5',
                'city' => 'Jakarta',
                'google_maps_url' => 'https://maps.google.com/?q=Arena+Court+Jakarta',
            ],
        ])->assertRedirect(route('admin.events.index'));

        $event = SportsEvent::query()->where('name', 'Basketball Scrimmage')->firstOrFail();

        $this->actingAs($admin)
            ->patch(route('admin.events.close-registration', $event))
            ->assertRedirect();

        $event->refresh();

        $this->assertNotNull($event->registration_closed_at);
    }
}
