<?php

namespace App\Models;

use Database\Factories\SportsEventFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SportsEvent extends Model
{
    /** @use HasFactory<SportsEventFactory> */
    use HasFactory;

    protected $fillable = [
        'venue_id',
        'name',
        'recurrence',
        'starts_at',
        'ends_at',
        'registration_closed_at',
    ];

    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'registration_closed_at' => 'datetime',
        ];
    }

    public function venue(): BelongsTo
    {
        return $this->belongsTo(Venue::class);
    }

    public function registrations(): HasMany
    {
        return $this->hasMany(Registration::class);
    }

    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'registrations')
            ->withTimestamps();
    }

    public function scopeUpcoming(Builder $query): Builder
    {
        return $query->where('starts_at', '>=', now()->startOfDay())
            ->orderBy('starts_at');
    }

    public function registrationIsOpen(): bool
    {
        return $this->registration_closed_at === null;
    }
}
