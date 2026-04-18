<?php

namespace App\Models;

use Database\Factories\SportsEventFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class SportsEvent extends Model
{
    /** @use HasFactory<SportsEventFactory> */
    use HasFactory;

    protected $fillable = [
        'venue_id',
        'name',
        'banner_url',
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

    public function tournament(): HasOne
    {
        return $this->hasOne(Tournament::class);
    }

    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'registrations')
            ->withTrashed()
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
