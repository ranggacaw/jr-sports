<?php

namespace App\Models;

use Database\Factories\TournamentFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tournament extends Model
{
    /** @use HasFactory<TournamentFactory> */
    use HasFactory;

    public const STATE_PENDING = 'pending';

    public const STATE_GROUP_STAGE = 'group_stage';

    public const STATE_BRACKET_STAGE = 'bracket_stage';

    public const STATE_COMPLETED = 'completed';

    protected $fillable = [
        'sports_event_id',
        'state',
        'champion_registration_id',
    ];

    public function sportsEvent(): BelongsTo
    {
        return $this->belongsTo(SportsEvent::class);
    }

    public function matches(): HasMany
    {
        return $this->hasMany(TournamentMatch::class);
    }

    public function groupStandings(): HasMany
    {
        return $this->hasMany(GroupStanding::class);
    }

    public function championRegistration(): BelongsTo
    {
        return $this->belongsTo(Registration::class, 'champion_registration_id');
    }
}
