<?php

namespace App\Models;

use Database\Factories\GroupStandingFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GroupStanding extends Model
{
    /** @use HasFactory<GroupStandingFactory> */
    use HasFactory;

    protected $fillable = [
        'tournament_id',
        'sports_event_id',
        'registration_id',
        'group_name',
        'wins',
        'losses',
        'points',
        'points_for',
        'points_against',
        'point_differential',
        'rank',
    ];

    protected function casts(): array
    {
        return [
            'wins' => 'integer',
            'losses' => 'integer',
            'points' => 'integer',
            'points_for' => 'integer',
            'points_against' => 'integer',
            'point_differential' => 'integer',
            'rank' => 'integer',
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

    public function registration(): BelongsTo
    {
        return $this->belongsTo(Registration::class);
    }
}
