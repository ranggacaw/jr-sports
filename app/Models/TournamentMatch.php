<?php

namespace App\Models;

use Database\Factories\TournamentMatchFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TournamentMatch extends Model
{
    /** @use HasFactory<TournamentMatchFactory> */
    use HasFactory;

    public const STAGE_GROUP = 'group_stage';

    public const STAGE_UPPER = 'upper_bracket';

    public const STAGE_LOWER = 'lower_bracket';

    public const STAGE_FINAL = 'grand_final';

    public const STATUS_SCHEDULED = 'scheduled';

    public const STATUS_COMPLETED = 'completed';

    protected $table = 'matches';

    protected $fillable = [
        'tournament_id',
        'sports_event_id',
        'code',
        'stage',
        'status',
        'bracket',
        'round_name',
        'group_name',
        'sort_order',
        'player_one_registration_id',
        'player_two_registration_id',
        'player_one_score',
        'player_two_score',
        'g1_p1_score',
        'g1_p2_score',
        'g2_p1_score',
        'g2_p2_score',
        'g3_p1_score',
        'g3_p2_score',
        'winner_registration_id',
        'loser_registration_id',
        'winner_to_match_code',
        'winner_to_slot',
        'loser_to_match_code',
        'loser_to_slot',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'player_one_score' => 'integer',
            'player_two_score' => 'integer',
            'g1_p1_score' => 'integer',
            'g1_p2_score' => 'integer',
            'g2_p1_score' => 'integer',
            'g2_p2_score' => 'integer',
            'g3_p1_score' => 'integer',
            'g3_p2_score' => 'integer',
            'winner_to_slot' => 'integer',
            'loser_to_slot' => 'integer',
            'completed_at' => 'datetime',
        ];
    }

    public function tournament(): BelongsTo
    {
        return $this->belongsTo(Tournament::class);
    }

    public function sportsEvent(): BelongsTo
    {
        return $this->belongsTo(SportsEvent::class);
    }

    public function playerOneRegistration(): BelongsTo
    {
        return $this->belongsTo(Registration::class, 'player_one_registration_id');
    }

    public function playerTwoRegistration(): BelongsTo
    {
        return $this->belongsTo(Registration::class, 'player_two_registration_id');
    }

    public function winnerRegistration(): BelongsTo
    {
        return $this->belongsTo(Registration::class, 'winner_registration_id');
    }

    public function loserRegistration(): BelongsTo
    {
        return $this->belongsTo(Registration::class, 'loser_registration_id');
    }

    public function hasParticipants(): bool
    {
        return $this->player_one_registration_id !== null && $this->player_two_registration_id !== null;
    }
}
