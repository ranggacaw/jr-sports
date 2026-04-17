<?php

namespace App\Models;

use Database\Factories\TournamentFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;

class Tournament extends Model
{
    /** @use HasFactory<TournamentFactory> */
    use HasFactory;

    public const FORMAT_SINGLES = 'singles';

    public const FORMAT_DOUBLES = 'doubles';

    public const SUPPORTED_ENTRANT_COUNTS = [4, 8, 16];

    public const STATE_PENDING = 'pending';

    public const STATE_GROUP_STAGE = 'group_stage';

    public const STATE_BRACKET_STAGE = 'bracket_stage';

    public const STATE_COMPLETED = 'completed';

    protected $fillable = [
        'sports_event_id',
        'state',
        'format',
        'entrant_count',
        'entrants',
        'reserve_registration_ids',
        'champion_registration_id',
    ];

    protected function casts(): array
    {
        return [
            'entrant_count' => 'integer',
            'entrants' => 'array',
            'reserve_registration_ids' => 'array',
        ];
    }

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

    /**
     * @return Collection<int, array{registration_id:int, team_name:?string, member_registration_ids:array<int, int>}>
     */
    public function entrantDefinitions(): Collection
    {
        $entrants = collect($this->entrants ?? [])
            ->map(fn (array $entrant) => [
                'registration_id' => (int) $entrant['registration_id'],
                'team_name' => $entrant['team_name'] ?? null,
                'member_registration_ids' => collect($entrant['member_registration_ids'] ?? [])
                    ->map(fn ($registrationId) => (int) $registrationId)
                    ->values()
                    ->all(),
            ])
            ->filter(fn (array $entrant) => $entrant['registration_id'] > 0)
            ->values();

        if ($entrants->isNotEmpty()) {
            return $entrants;
        }

        $registrationIds = $this->relationLoaded('groupStandings')
            ? $this->groupStandings->pluck('registration_id')
            : $this->groupStandings()->pluck('registration_id');

        return $registrationIds
            ->map(fn ($registrationId) => (int) $registrationId)
            ->unique()
            ->values()
            ->map(fn (int $registrationId) => [
                'registration_id' => $registrationId,
                'team_name' => null,
                'member_registration_ids' => [$registrationId],
            ]);
    }

    /**
     * @return Collection<int, array{registration_id:int, team_name:?string, member_registration_ids:array<int, int>}>
     */
    public function entrantsByRegistrationId(): Collection
    {
        return $this->entrantDefinitions()->keyBy('registration_id');
    }

    /**
     * @return array<int, int>
     */
    public function reserveIds(): array
    {
        return collect($this->reserve_registration_ids ?? [])
            ->map(fn ($registrationId) => (int) $registrationId)
            ->values()
            ->all();
    }
}
