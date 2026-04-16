<?php

namespace Tests\Feature;

use App\Models\SportsEvent;
use App\Models\Tournament;
use App\Models\TournamentMatch;
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
        $viewer = User::factory()->create(['name' => 'Alex Viewer']);
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

    public function test_authenticated_user_can_view_read_only_tournament_data_on_event_details(): void
    {
        $viewer = User::factory()->create(['name' => 'Alex Viewer']);
        $opponent = User::factory()->create(['name' => 'Tournament Opponent']);
        $event = SportsEvent::factory()->create();

        $viewerRegistration = $event->registrations()->create([
            'user_id' => $viewer->id,
        ]);
        $opponentRegistration = $event->registrations()->create([
            'user_id' => $opponent->id,
        ]);

        $tournament = Tournament::factory()->create([
            'sports_event_id' => $event->id,
            'state' => Tournament::STATE_BRACKET_STAGE,
        ]);

        $tournament->groupStandings()->createMany([
            [
                'sports_event_id' => $event->id,
                'registration_id' => $viewerRegistration->id,
                'group_name' => 'A',
                'points' => 3,
                'point_differential' => 5,
                'rank' => 1,
            ],
            [
                'sports_event_id' => $event->id,
                'registration_id' => $opponentRegistration->id,
                'group_name' => 'A',
                'points' => 0,
                'point_differential' => -5,
                'rank' => 2,
            ],
        ]);

        $tournament->matches()->create([
            'sports_event_id' => $event->id,
            'code' => 'GA1',
            'stage' => TournamentMatch::STAGE_GROUP,
            'status' => TournamentMatch::STATUS_COMPLETED,
            'group_name' => 'A',
            'round_name' => 'Group A',
            'sort_order' => 1,
            'player_one_registration_id' => $viewerRegistration->id,
            'player_two_registration_id' => $opponentRegistration->id,
            'player_one_score' => 21,
            'player_two_score' => 16,
            'winner_registration_id' => $viewerRegistration->id,
            'loser_registration_id' => $opponentRegistration->id,
        ]);

        $tournament->matches()->create([
            'sports_event_id' => $event->id,
            'code' => 'U1',
            'stage' => TournamentMatch::STAGE_UPPER,
            'status' => TournamentMatch::STATUS_SCHEDULED,
            'round_name' => 'Upper Round 1',
            'sort_order' => 101,
            'player_one_registration_id' => $viewerRegistration->id,
            'player_two_registration_id' => $opponentRegistration->id,
        ]);

        $this->actingAs($viewer)
            ->get(route('events.show', $event))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Events/Show')
                ->where('event.tournament.state', Tournament::STATE_BRACKET_STAGE)
                ->where('event.tournament.groups.0.name', 'A')
                ->where('event.tournament.groups.0.entries.0.player_name', 'Alex Viewer')
                ->where('event.tournament.groups.0.entries.0.qualification_rank', 1)
                ->where('event.tournament.groups.0.entries.0.bracket_label', 'Upper Bracket')
                ->where('event.tournament.qualification.0.player_name', 'Alex Viewer')
                ->where('event.tournament.qualification.0.qualification_rank', 1)
                ->where('event.tournament.my_qualification.qualification_rank', 1)
                ->where('event.tournament.my_qualification.bracket_label', 'Upper Bracket')
                ->where('event.tournament.my_matches', fn ($matches) => collect($matches)->pluck('code')->all() === ['GA1', 'U1'])
            );
    }
}
