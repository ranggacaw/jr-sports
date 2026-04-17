<?php

namespace Tests\Feature;

use App\Models\SportsEvent;
use App\Models\Tournament;
use App\Models\TournamentMatch;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
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

    public function test_admin_can_add_players_to_an_event_roster(): void
    {
        $admin = User::factory()->admin()->create();
        $firstUser = User::factory()->create();
        $secondUser = User::factory()->create();
        $event = SportsEvent::factory()->create();

        $this->actingAs($admin)
            ->from(route('admin.events.show', $event))
            ->post(route('admin.events.registrations.store', $event), [
                'user_ids' => [$firstUser->id, $secondUser->id],
            ])
            ->assertRedirect(route('admin.events.show', $event));

        $this->assertDatabaseHas('registrations', [
            'sports_event_id' => $event->id,
            'user_id' => $firstUser->id,
        ]);

        $this->assertDatabaseHas('registrations', [
            'sports_event_id' => $event->id,
            'user_id' => $secondUser->id,
        ]);
    }

    public function test_admin_can_view_qualification_data_on_the_event_management_screen(): void
    {
        $admin = User::factory()->admin()->create();
        $firstPlayer = User::factory()->create(['name' => 'Seed One']);
        $secondPlayer = User::factory()->create(['name' => 'Seed Two']);
        $event = SportsEvent::factory()->create();

        $firstRegistration = $event->registrations()->create(['user_id' => $firstPlayer->id]);
        $secondRegistration = $event->registrations()->create(['user_id' => $secondPlayer->id]);

        $tournament = Tournament::factory()->create([
            'sports_event_id' => $event->id,
            'state' => Tournament::STATE_BRACKET_STAGE,
        ]);

        $tournament->groupStandings()->createMany([
            [
                'sports_event_id' => $event->id,
                'registration_id' => $firstRegistration->id,
                'group_name' => 'A',
                'points' => 3,
                'point_differential' => 4,
                'rank' => 1,
            ],
            [
                'sports_event_id' => $event->id,
                'registration_id' => $secondRegistration->id,
                'group_name' => 'A',
                'points' => 0,
                'point_differential' => -4,
                'rank' => 2,
            ],
        ]);

        $tournament->matches()->create([
            'sports_event_id' => $event->id,
            'code' => 'U1',
            'stage' => TournamentMatch::STAGE_UPPER,
            'status' => TournamentMatch::STATUS_SCHEDULED,
            'round_name' => 'Upper Round 1',
            'sort_order' => 101,
            'player_one_registration_id' => $firstRegistration->id,
            'player_two_registration_id' => $secondRegistration->id,
        ]);

        $this->actingAs($admin)
            ->get(route('admin.events.show', $event))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Events/Show')
                ->where('event.tournament.groups.0.entries.0.qualification_rank', 1)
                ->where('event.tournament.groups.0.entries.0.bracket_label', 'Upper Bracket')
                ->where('event.tournament.qualification.0.player_name', 'Seed One')
                ->where('event.tournament.qualification.1.player_name', 'Seed Two')
            );
    }
}
