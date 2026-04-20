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

    public function test_authenticated_user_can_view_a_finished_event_details_page(): void
    {
        $viewer = User::factory()->create(['name' => 'Alex Viewer']);
        $participant = User::factory()->create(['name' => 'Jordan Player']);
        $event = SportsEvent::factory()
            ->for(Venue::factory()->state([
                'name' => 'Arena Court',
                'address' => 'Jl. Gatot Subroto No. 5',
                'city' => 'Jakarta',
            ]))
            ->create([
                'name' => 'Finished Badminton',
                'recurrence' => 'Weekly',
                'starts_at' => now()->subDays(3),
                'ends_at' => now()->subDays(3)->addHours(2),
                'registration_closed_at' => now()->subDays(4),
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
                ->where('event.name', 'Finished Badminton')
                ->where('event.registration_is_open', false)
                ->where('event.is_registered', true)
                ->where('event.participants_count', 2)
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

    public function test_authenticated_user_can_view_doubles_team_names_members_and_reserves(): void
    {
        $viewer = User::factory()->create(['name' => 'Alex Viewer']);
        $partner = User::factory()->create(['name' => 'Jamie Partner']);
        $teamTwoA = User::factory()->create(['name' => 'Nina Smash']);
        $teamTwoB = User::factory()->create(['name' => 'Rafi Net']);
        $teamThreeA = User::factory()->create(['name' => 'Dina Rally']);
        $teamThreeB = User::factory()->create(['name' => 'Tono Drive']);
        $teamFourA = User::factory()->create(['name' => 'Mira Court']);
        $teamFourB = User::factory()->create(['name' => 'Bima Drop']);
        $reserve = User::factory()->create(['name' => 'Sari Reserve']);
        $event = SportsEvent::factory()->create();

        $viewerRegistration = $event->registrations()->create(['user_id' => $viewer->id]);
        $partnerRegistration = $event->registrations()->create(['user_id' => $partner->id]);
        $teamTwoARegistration = $event->registrations()->create(['user_id' => $teamTwoA->id]);
        $teamTwoBRegistration = $event->registrations()->create(['user_id' => $teamTwoB->id]);
        $teamThreeARegistration = $event->registrations()->create(['user_id' => $teamThreeA->id]);
        $teamThreeBRegistration = $event->registrations()->create(['user_id' => $teamThreeB->id]);
        $teamFourARegistration = $event->registrations()->create(['user_id' => $teamFourA->id]);
        $teamFourBRegistration = $event->registrations()->create(['user_id' => $teamFourB->id]);
        $reserveRegistration = $event->registrations()->create(['user_id' => $reserve->id]);

        $tournament = Tournament::factory()->create([
            'sports_event_id' => $event->id,
            'state' => Tournament::STATE_GROUP_STAGE,
            'format' => Tournament::FORMAT_DOUBLES,
            'entrant_count' => 4,
            'entrants' => [
                ['registration_id' => $viewerRegistration->id, 'team_name' => 'Sky Shuttlers', 'member_registration_ids' => [$viewerRegistration->id, $partnerRegistration->id]],
                ['registration_id' => $teamTwoARegistration->id, 'team_name' => 'Net Rush', 'member_registration_ids' => [$teamTwoARegistration->id, $teamTwoBRegistration->id]],
                ['registration_id' => $teamThreeARegistration->id, 'team_name' => 'Court Storm', 'member_registration_ids' => [$teamThreeARegistration->id, $teamThreeBRegistration->id]],
                ['registration_id' => $teamFourARegistration->id, 'team_name' => 'Rapid Rally', 'member_registration_ids' => [$teamFourARegistration->id, $teamFourBRegistration->id]],
            ],
            'reserve_registration_ids' => [$reserveRegistration->id],
        ]);

        $tournament->groupStandings()->createMany([
            [
                'sports_event_id' => $event->id,
                'registration_id' => $viewerRegistration->id,
                'group_name' => 'A',
                'points' => 3,
                'point_differential' => 4,
                'rank' => 1,
            ],
            [
                'sports_event_id' => $event->id,
                'registration_id' => $teamTwoARegistration->id,
                'group_name' => 'A',
                'points' => 0,
                'point_differential' => -4,
                'rank' => 2,
            ],
            [
                'sports_event_id' => $event->id,
                'registration_id' => $teamThreeARegistration->id,
                'group_name' => 'A',
                'points' => 3,
                'point_differential' => 2,
                'rank' => 3,
            ],
            [
                'sports_event_id' => $event->id,
                'registration_id' => $teamFourARegistration->id,
                'group_name' => 'A',
                'points' => 0,
                'point_differential' => -2,
                'rank' => 4,
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
            'player_two_registration_id' => $teamTwoARegistration->id,
            'player_one_score' => 2,
            'player_two_score' => 0,
            'winner_registration_id' => $viewerRegistration->id,
            'loser_registration_id' => $teamTwoARegistration->id,
        ]);

        $this->actingAs($viewer)
            ->get(route('events.show', $event))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Events/Show')
                ->where('event.tournament.format', Tournament::FORMAT_DOUBLES)
                ->where('event.tournament.groups.0.entries.0.player_name', 'Sky Shuttlers')
                ->where('event.tournament.groups.0.entries.0.member_names', ['Alex Viewer', 'Jamie Partner'])
                ->where('event.tournament.reserves.0.name', 'Sari Reserve')
                ->where('event.tournament.my_matches.0.code', 'GA1')
                ->where('event.tournament.my_matches.0.player_one_name', 'Sky Shuttlers')
            );
    }
}
