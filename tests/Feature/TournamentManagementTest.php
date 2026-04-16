<?php

namespace Tests\Feature;

use App\Models\GroupStanding;
use App\Models\Registration;
use App\Models\SportsEvent;
use App\Models\Tournament;
use App\Models\TournamentMatch;
use App\Models\User;
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

    public function test_admin_can_only_start_tournament_with_exactly_sixteen_registered_players(): void
    {
        $admin = User::factory()->admin()->create();
        $notReadyEvent = SportsEvent::factory()->create();

        Registration::factory()->count(15)->create([
            'sports_event_id' => $notReadyEvent->id,
        ]);

        $this->actingAs($admin)
            ->from(route('admin.events.index'))
            ->post(route('admin.events.tournament.start', $notReadyEvent))
            ->assertRedirect(route('admin.events.index'))
            ->assertSessionHasErrors('tournament');

        $readyEvent = SportsEvent::factory()->create();

        Registration::factory()->count(16)->create([
            'sports_event_id' => $readyEvent->id,
        ]);

        $this->actingAs($admin)
            ->post(route('admin.events.tournament.start', $readyEvent))
            ->assertRedirect();

        $tournament = $readyEvent->fresh()->tournament;

        $this->assertNotNull($tournament);
        $this->assertSame(Tournament::STATE_GROUP_STAGE, $tournament->state);
        $this->assertSame(16, $tournament->groupStandings()->count());
        $this->assertSame(24, $tournament->matches()->where('stage', TournamentMatch::STAGE_GROUP)->count());
    }

    public function test_group_stage_score_entry_is_idempotent_and_updates_standings(): void
    {
        $admin = User::factory()->admin()->create();
        $event = $this->createEventWithTournament();
        $match = $event->tournament->matches()->where('code', 'GA1')->firstOrFail();

        $this->actingAs($admin)
            ->post(route('admin.matches.score', $match), [
                'g1_p1_score' => 21,
                'g1_p2_score' => 18,
                'g2_p1_score' => 21,
                'g2_p2_score' => 18,
            ])
            ->assertRedirect();

        $this->actingAs($admin)
            ->post(route('admin.matches.score', $match), [
                'g1_p1_score' => 21,
                'g1_p2_score' => 18,
                'g2_p1_score' => 21,
                'g2_p2_score' => 18,
            ])
            ->assertRedirect();

        $match->refresh();
        $winnerStanding = $event->tournament->groupStandings()->where('registration_id', $match->winner_registration_id)->firstOrFail();
        $loserStanding = $event->tournament->groupStandings()->where('registration_id', $match->loser_registration_id)->firstOrFail();

        $this->assertSame(TournamentMatch::STATUS_COMPLETED, $match->status);
        $this->assertSame(3, $winnerStanding->points);
        $this->assertSame(0, $loserStanding->points);
    }

    public function test_group_stage_completion_seeds_the_upper_and_lower_brackets(): void
    {
        $event = $this->createEventWithTournament();
        $groups = $this->completeGroupStageForQualificationScenario($event);

        $tournament = $event->fresh()->tournament()->with('matches')->firstOrFail();
        $matches = $tournament->matches->keyBy('code');

        $this->assertSame(Tournament::STATE_BRACKET_STAGE, $tournament->state);

        $this->assertMatchParticipants($matches['U1'], $groups['B'][0], $groups['D'][1]);
        $this->assertMatchParticipants($matches['U2'], $groups['A'][0], $groups['A'][1]);
        $this->assertMatchParticipants($matches['U3'], $groups['C'][0], $groups['A'][2]);
        $this->assertMatchParticipants($matches['U4'], $groups['D'][0], $groups['B'][1]);

        $this->assertMatchParticipants($matches['L1'], $groups['D'][2], $groups['A'][3]);
        $this->assertMatchParticipants($matches['L2'], $groups['B'][2], $groups['C'][2]);
        $this->assertMatchParticipants($matches['L3'], $groups['C'][3], $groups['B'][3]);
        $this->assertMatchParticipants($matches['L4'], $groups['C'][1], $groups['D'][3]);
    }

    public function test_upper_bracket_loser_is_placed_into_the_next_lower_round_slot(): void
    {
        $event = $this->createEventWithTournament();
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

        $lowerMatch = $tournament->fresh()->matches()->where('code', 'L5')->firstOrFail();

        $this->assertSame($upperMatch->fresh()->loser_registration_id, $lowerMatch->player_one_registration_id);
    }

    private function createEventWithTournament(): SportsEvent
    {
        $event = SportsEvent::factory()->create();

        Registration::factory()->count(16)->create([
            'sports_event_id' => $event->id,
        ]);

        $this->postAsAdmin(route('admin.events.tournament.start', $event));

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

    /**
     * @return array<string, array<int, int>>
     */
    private function completeGroupStageForQualificationScenario(SportsEvent $event): array
    {
        $recordMatchScore = app(RecordMatchScore::class);
        $tournament = $event->tournament()->with(['matches', 'groupStandings'])->firstOrFail();
        $groups = $tournament->groupStandings
            ->sortBy(['group_name', 'registration_id'])
            ->groupBy('group_name')
            ->map(fn ($standings) => $standings->pluck('registration_id')->values()->all())
            ->all();

        $plans = [
            'GA1' => [1, false],
            'GA2' => [2, true],
            'GA3' => [1, false],
            'GA4' => [1, false],
            'GA5' => [1, false],
            'GA6' => [1, false],
            'GB1' => [1, false],
            'GB2' => [1, false],
            'GB3' => [1, false],
            'GB4' => [1, true],
            'GB5' => [1, false],
            'GB6' => [1, true],
            'GC1' => [1, false],
            'GC2' => [1, false],
            'GC3' => [1, true],
            'GC4' => [1, false],
            'GC5' => [2, true],
            'GC6' => [1, true],
            'GD1' => [1, false],
            'GD2' => [1, true],
            'GD3' => [1, true],
            'GD4' => [1, true],
            'GD5' => [1, true],
            'GD6' => [1, false],
        ];

        foreach ($tournament->matches->where('stage', TournamentMatch::STAGE_GROUP)->sortBy('sort_order') as $match) {
            [$winnerSlot, $goesThreeGames] = $plans[$match->code];

            $recordMatchScore->handle($match, $this->scoresForMatchResult($winnerSlot, $goesThreeGames));
        }

        return $groups;
    }

    private function scoresForMatchResult(int $winnerSlot, bool $goesThreeGames): array
    {
        if ($winnerSlot === 1) {
            return $goesThreeGames
                ? [
                    'g1_p1_score' => 21,
                    'g1_p2_score' => 10,
                    'g2_p1_score' => 10,
                    'g2_p2_score' => 21,
                    'g3_p1_score' => 21,
                    'g3_p2_score' => 10,
                ]
                : [
                    'g1_p1_score' => 21,
                    'g1_p2_score' => 10,
                    'g2_p1_score' => 21,
                    'g2_p2_score' => 10,
                ];
        }

        return $goesThreeGames
            ? [
                'g1_p1_score' => 10,
                'g1_p2_score' => 21,
                'g2_p1_score' => 21,
                'g2_p2_score' => 10,
                'g3_p1_score' => 10,
                'g3_p2_score' => 21,
            ]
            : [
                'g1_p1_score' => 10,
                'g1_p2_score' => 21,
                'g2_p1_score' => 10,
                'g2_p2_score' => 21,
            ];
    }

    private function assertMatchParticipants(TournamentMatch $match, int $playerOneRegistrationId, int $playerTwoRegistrationId): void
    {
        $this->assertSame($playerOneRegistrationId, $match->player_one_registration_id, $match->code.' player one mismatch.');
        $this->assertSame($playerTwoRegistrationId, $match->player_two_registration_id, $match->code.' player two mismatch.');
    }

    private function postAsAdmin(string $url): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->post($url)->assertRedirect();
    }
}
