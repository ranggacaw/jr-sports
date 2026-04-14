<?php

namespace App\Http\Controllers;

use App\Models\SportsEvent;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function index(Request $request): Response
    {
        $userId = $request->user()?->id;

        $events = SportsEvent::query()
            ->with('venue')
            ->withCount('participants')
            ->upcoming();

        if ($userId) {
            $events->with(['participants:id,name']);
        }

        return Inertia::render('Events/Index', [
            'events' => $events
                ->get()
                ->map(fn (SportsEvent $event) => $this->eventPayload($event, $userId, $userId !== null)),
        ]);
    }

    public function dashboard(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Dashboard', [
            'registeredEvents' => $user->sportsEvents()
                ->with('venue')
                ->where('starts_at', '>=', now()->startOfDay())
                ->orderBy('starts_at')
                ->get()
                ->map(fn (SportsEvent $event) => $this->eventPayload($event->loadMissing('participants:id,name'), $user->id)),
        ]);
    }

    public function show(Request $request, SportsEvent $sportsEvent): Response
    {
        abort_unless($sportsEvent->starts_at?->gte(now()->startOfDay()), 404);

        $sportsEvent->load([
            'venue',
            'participants' => fn ($query) => $query
                ->select('users.id', 'users.name')
                ->orderBy('users.name'),
        ])->loadCount('participants');

        return Inertia::render('Events/Show', [
            'event' => $this->eventPayload($sportsEvent, $request->user()->id),
        ]);
    }

    private function eventPayload(SportsEvent $event, ?int $userId, bool $includeParticipants = true): array
    {
        $participants = $event->relationLoaded('participants') ? $event->participants : collect();

        return [
            'id' => $event->id,
            'name' => $event->name,
            'recurrence' => $event->recurrence,
            'starts_at' => $event->starts_at?->toIso8601String(),
            'ends_at' => $event->ends_at?->toIso8601String(),
            'registration_closed_at' => $event->registration_closed_at?->toIso8601String(),
            'registration_is_open' => $event->registrationIsOpen(),
            'participants_count' => $event->participants_count ?? $event->participants()->count(),
            'is_registered' => $userId
                ? $participants->contains('id', $userId)
                : false,
            'participants' => $includeParticipants
                ? $participants
                    ->map(fn ($participant) => [
                        'id' => $participant->id,
                        'name' => $participant->name,
                    ])
                    ->values()
                    ->all()
                : [],
            'venue' => [
                'name' => $event->venue->name,
                'address' => $event->venue->address,
                'city' => $event->venue->city,
                'google_maps_url' => $event->venue->google_maps_url,
            ],
        ];
    }
}
