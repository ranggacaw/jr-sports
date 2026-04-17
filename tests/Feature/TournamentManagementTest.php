<?php

namespace Tests\Feature;

use App\Models\GroupStanding;
use App\Models\Registration;
use App\Models\SportsEvent;
use App\Models\Tournament;
use App\Models\TournamentMatch;
use App\Models\User;
use App\Services\Tournaments\BuildQualificationRanking;
use App\Services\Tournaments\RecordMatchScore;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TournamentManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_tournament_related_models_can_be_instantiated_with_factories(): void
    {
        $event = SportsEvent::factory()->create();
        $tournament = Tournament::factory()->create([
            'sports_event_id' => $event->id,
        ]);
        $registration = Registration::factory()->create([
            'sports_event_id' => $event->id,
        ]);

        $match = TournamentMatch::factory()->create([
            'tournament_id' => $tournament->id,
            'sports_event_id' => $event->id,
            'player_one_registration_id' => $registration->id,
            'code' => 'TEST-M1',
        ]);

        $standing = GroupStanding::factory()->create([
            'tournament_id' => $tournament->id,
            'sports_event_id' => $event->id,
            'registration_id' => $registration->id,
        ]);

        $this->assertModelExists($tournament);
        $this->assertModelExists($match);
        $this->assertModelExists($standing);
    }

    public function test_admin_can_start_a_four_player_singles_tournament_with_reserves(): void
    {
        $event = SportsEvent::factory()->create();
        $registrations = Registration::factory()->count(6)->create([
            'sports_event_id' => $event->id,
        ])->values();

        $this->postAsAdmin(route('admin.events.tournament.start', $event), [
            'format' => Tournament::FORMAT_SINGLES,
            'entrant_count' => 4,
            'active_registration_ids' => $registrations->take(4)->pluck('id')->all(),
            'reserve_registration_ids' => $registrations->slice(4)->pluck('id')->all(),
        ]);

        $tournament = $event->fresh()->tournament()->with(['matches', 'groupStandings'])->firstOrFail();
        $reserveIds = $registrations->slice(4)->pluck('id');

        $this->assertSame(Tournament::FORMAT_SINGLES, $tournament->format);
        $this->assertSame(4, $tournament->entrant_count);
        $this->assertSame(Tournament::STATE_GROUP_STAGE, $tournament->state);
        $this->assertSame(4, $tournament->groupStandings->count());
        $this->assertSame(6, $tournament->matches->where('stage', TournamentMatch::STAGE_GROUP)->count());
        $this->assertSame($reserveIds->values()->all(), $tournament->reserveIds());
        $this->assertEmpty($tournament->groupStandings->whereIn('registration_id', $reserveIds)->all());
        $this->assertSame(0, $tournament->matches
            ->where('stage', TournamentMatch::STAGE_GROUP)
            ->filter(fn (TournamentMatch $match) => $reserveIds->contains($match->player_one_registration_id)
                || $reserveIds->contains($match->player_two_registration_id))
            ->count());
    }

    public function test_admin_can_start_a_singles_tournament_even_when_unused_team_fields_are_present(): void
    {
        $event = SportsEvent::factory()->create();
        $registrations = Registration::factory()->count(4)->create([
            'sports_event_id' => $event->id,
        ])->values();

        $this->postAsAdmin(route('admin.events.tournament.start', $event), [
            'format' => Tournament::FORMAT_SINGLES,
            'entrant_count' => 4,
            'active_registration_ids' => $registrations->pluck('id')->all(),
            'reserve_registration_ids' => [],
            'teams' => [
                ['name' => '', 'member_registration_ids' => ['', '']],
                ['name' => '', 'member_registration_ids' => ['', '']],
                ['name' => '', 'member_registration_ids' => ['', '']],
                ['name' => '', 'member_registration_ids' => ['', '']],
            ],
        ]);

        $tournament = $event->fresh()->tournament()->firstOrFail();

        $this->assertSame(Tournament::FORMAT_SINGLES, $tournament->format);
        $this->assertSame(4, $tournament->entrant_count);
    }

    public function test_admin_can_start_a_doubles_tournament_with_named_teams_and_reserves(): void
    {
        $event = SportsEvent::factory()->create();
        $registrations = Registration::factory()->count(10)->create([
            'sports_event_id' => $event->id,
        ])->values();

        $this->postAsAdmin(route('admin.events.tournament.start', $event), [
            'format' => Tournament::FORMAT_DOUBLES,
            'entrant_count' => 4,
            'teams' => [
                ['name' => 'Falcon Smash', 'member_registration_ids' => [$registrations[0]->id, $registrations[1]->id]],
                ['name' => 'Net Rush', 'member_registration_ids' => [$registrations[2]->id, $registrations[3]->id]],
                ['name' => 'Court Storm', 'member_registration_ids' => [$registrations[4]->id, $registrations[5]->id]],
                ['name' => 'Rapid Rally', 'member_registration_ids' => [$registrations[6]->id, $registrations[7]->id]],
            ],
            'reserve_registration_ids' => [$registrations[8]->id, $registrations[9]->id],
        ]);

        $tournament = $event->fresh()->tournament()->firstOrFail();

        $this->assertSame(Tournament::FORMAT_DOUBLES, $tournament->format);
        $this->assertSame(4, $tournament->entrant_count);
        $this->assertSame(['Falcon Smash', 'Net Rush', 'Court Storm', 'Rapid Rally'], collect($tournament->entrants)->pluck('team_name')->all());
        $this->assertSame([$registrations[0]->id, $registrations[1]->id], $tournament->entrants[0]['member_registration_ids']);
        $this->assertSame([$registrations[8]->id, $registrations[9]->id], $tournament->reserveIds());
        $this->assertSame(4, $tournament->groupStandings()->count());
    }

    public function test_admin_cannot_assign_the_same_player_to_multiple_doubles_teams(): void
    {
        $event = SportsEvent::factory()->create();
        $registrations = Registration::factory()->count(8)->create([
            'sports_event_id' => $event->id,
        ])->values();

        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->from(route('admin.events.show', $event))
            ->post(route('admin.events.tournament.start', $event), [
                'format' => Tournament::FORMAT_DOUBLES,
                'entrant_count' => 4,
                'teams' => [
                    ['name' => 'Falcon Smash', 'member_registration_ids' => [$registrations[0]->id, $registrations[1]->id]],
                    ['name' => 'Net Rush', 'member_registration_ids' => [$registrations[0]->id, $registrations[2]->id]],
                    ['name' => 'Court Storm', 'member_registration_ids' => [$registrations[3]->id, $registrations[4]->id]],
                    ['name' => 'Rapid Rally', 'member_registration_ids' => [$registrations[5]->id, $registrations[6]->id]],
                ],
            ])
            ->assertRedirect(route('admin.events.show', $event))
            ->assertSessionHasErrors('teams.1.member_registration_ids');
    }

    public function test_group_stage_score_entry_is_idempotent_and_updates_standings(): void
    {
        $event = $this->createConfiguredSinglesTournament(4);
        $match = $event->tournament->matches()->where('code', 'GA1')->firstOrFail();

        $this->postAsAdmin(route('admin.matches.score', $match), [
            'g1_p1_score' => 21,
            'g1_p2_score' => 18,
            'g2_p1_score' => 21,
            'g2_p2_score' => 18,
        ]);

        $this->postAsAdmin(route('admin.matches.score', $match), [
            'g1_p1_score' => 21,
            'g1_p2_score' => 18,
            'g2_p1_score' => 21,
            'g2_p2_score' => 18,
        ]);

        $match->refresh();
        $winnerStanding = $event->tournament->groupStandings()->where('registration_id', $match->winner_registration_id)->firstOrFail();
        $loserStanding = $event->tournament->groupStandings()->where('registration_id', $match->loser_registration_id)->firstOrFail();

        $this->assertSame(TournamentMatch::STATUS_COMPLETED, $match->status);
        $this->assertSame(3, $winnerStanding->points);
        $this->assertSame(0, $loserStanding->points);
    }

    public function test_group_stage_completion_seeds_brackets_for_supported_entrant_counts(): void
    {
        foreach ([4, 8, 16] as $entrantCount) {
            $event = $this->createConfiguredSinglesTournament($entrantCount);
            $this->completeGroupStage($event);

            $tournament = $event->fresh()->tournament()->with('matches', 'groupStandings')->firstOrFail();

            $this->assertSame(Tournament::STATE_BRACKET_STAGE, $tournament->state);

            $this->assertSeededBracket($tournament, $entrantCount);
        }
    }

    public function test_upper_bracket_loser_is_placed_into_the_next_lower_round_slot_for_an_eight_entrant_tournament(): void
    {
        $event = $this->createConfiguredSinglesTournament(8);
        $this->completeGroupStage($event);

        $recordMatchScore = app(RecordMatchScore::class);
        $tournament = $event->fresh()->tournament()->with('matches')->firstOrFail();
        $upperMatch = $tournament->matches->firstWhere('code', 'U1');

        $recordMatchScore->handle($upperMatch, [
            'g1_p1_score' => 15,
            'g1_p2_score' => 21,
            'g2_p1_score' => 15,
            'g2_p2_score' => 21,
        ]);

        $lowerMatch = $tournament->fresh()->matches()->where('code', 'L3')->firstOrFail();

        $this->assertSame($upperMatch->fresh()->loser_registration_id, $lowerMatch->player_one_registration_id);
    }

    private function createConfiguredSinglesTournament(int $entrantCount): SportsEvent
    {
        $event = SportsEvent::factory()->create();
        $registrations = Registration::factory()->count($entrantCount)->create([
            'sports_event_id' => $event->id,
        ]);

        $this->postAsAdmin(route('admin.events.tournament.start', $event), [
            'format' => Tournament::FORMAT_SINGLES,
            'entrant_count' => $entrantCount,
            'active_registration_ids' => $registrations->pluck('id')->all(),
            'reserve_registration_ids' => [],
        ]);

        return $event->fresh()->load(['tournament.matches', 'tournament.groupStandings']);
    }

    private function completeGroupStage(SportsEvent $event): void
    {
        $recordMatchScore = app(RecordMatchScore::class);
        $tournament = $event->tournament()->with(['matches', 'groupStandings'])->firstOrFail();
        $groupSeeds = $tournament->groupStandings
            ->sortBy(['group_name', 'registration_id'])
            ->groupBy('group_name')
            ->map(fn ($standings) => $standings->pluck('registration_id')->values()->flip());

        foreach ($tournament->matches->where('stage', TournamentMatch::STAGE_GROUP)->sortBy('sort_order') as $match) {
            $positions = $groupSeeds[$match->group_name];
            $playerOneSeed = $positions[$match->player_one_registration_id];
            $playerTwoSeed = $positions[$match->player_two_registration_id];

            if ($playerOneSeed < $playerTwoSeed) {
                $recordMatchScore->handle($match, [
                    'g1_p1_score' => 21,
                    'g1_p2_score' => 10,
                    'g2_p1_score' => 21,
                    'g2_p2_score' => 10,
                ]);
            } else {
                $recordMatchScore->handle($match, [
                    'g1_p1_score' => 10,
                    'g1_p2_score' => 21,
                    'g2_p1_score' => 10,
                    'g2_p2_score' => 21,
                ]);
            }
        }
    }

    private function assertSeededBracket(Tournament $tournament, int $entrantCount): void
    {
        $qualification = app(BuildQualificationRanking::class)->handle($tournament)->keyBy('qualification_rank');
        $matches = $tournament->matches->keyBy('code');
        $half = (int) ($entrantCount / 2);
        $pairings = match ($half) {
            2 => [[1, 2]],
            4 => [[1, 4], [2, 3]],
            8 => [[1, 8], [4, 5], [2, 7], [3, 6]],
        };
        $upperCodes = match ($entrantCount) {
            4 => ['U1'],
            8 => ['U1', 'U2'],
            16 => ['U1', 'U2', 'U3', 'U4'],
        };
        $lowerCodes = match ($entrantCount) {
            4 => ['L1'],
            8 => ['L1', 'L2'],
            16 => ['L1', 'L2', 'L3', 'L4'],
        };

        foreach ($upperCodes as $index => $code) {
            [$seedOne, $seedTwo] = $pairings[$index];

            $this->assertMatchParticipants(
                $matches[$code],
                $qualification[$seedOne]['registration_id'],
                $qualification[$seedTwo]['registration_id'],
            );
        }

        foreach ($lowerCodes as $index => $code) {
            [$seedOne, $seedTwo] = $pairings[$index];

            $this->assertMatchParticipants(
                $matches[$code],
                $qualification[$half + $seedOne]['registration_id'],
                $qualification[$half + $seedTwo]['registration_id'],
            );
        }
    }

    private function assertMatchParticipants(TournamentMatch $match, int $playerOneRegistrationId, int $playerTwoRegistrationId): void
    {
        $this->assertSame($playerOneRegistrationId, $match->player_one_registration_id, $match->code.' player one mismatch.');
        $this->assertSame($playerTwoRegistrationId, $match->player_two_registration_id, $match->code.' player two mismatch.');
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function postAsAdmin(string $url, array $payload = []): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->post($url, $payload)->assertRedirect();
    }
}
