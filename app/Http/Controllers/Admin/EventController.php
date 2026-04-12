<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SportsEvent;
use App\Models\Venue;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Events/Index', [
            'events' => SportsEvent::query()
                ->with(['venue', 'participants'])
                ->withCount('participants')
                ->orderBy('starts_at')
                ->get()
                ->map(fn (SportsEvent $event) => $this->eventListPayload($event)),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Events/Form', [
            'event' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $payload = $this->validatedPayload($request);

        $venue = Venue::create($payload['venue']);

        SportsEvent::create([
            ...$payload['event'],
            'venue_id' => $venue->id,
        ]);

        return redirect()->route('admin.events.index')
            ->with('success', 'Event created successfully.');
    }

    public function edit(SportsEvent $sportsEvent): Response
    {
        $sportsEvent->load('venue');

        return Inertia::render('Admin/Events/Form', [
            'event' => [
                'id' => $sportsEvent->id,
                'name' => $sportsEvent->name,
                'recurrence' => $sportsEvent->recurrence,
                'starts_at' => $sportsEvent->starts_at?->format('Y-m-d\TH:i'),
                'ends_at' => $sportsEvent->ends_at?->format('Y-m-d\TH:i'),
                'registration_closed_at' => $sportsEvent->registration_closed_at?->toIso8601String(),
                'venue' => [
                    'name' => $sportsEvent->venue->name,
                    'address' => $sportsEvent->venue->address,
                    'city' => $sportsEvent->venue->city,
                    'google_maps_url' => $sportsEvent->venue->google_maps_url,
                ],
            ],
        ]);
    }

    public function update(Request $request, SportsEvent $sportsEvent): RedirectResponse
    {
        $payload = $this->validatedPayload($request);

        $sportsEvent->venue->update($payload['venue']);
        $sportsEvent->update($payload['event']);

        return redirect()->route('admin.events.index')
            ->with('success', 'Event updated successfully.');
    }

    public function closeRegistration(SportsEvent $sportsEvent): RedirectResponse
    {
        if ($sportsEvent->registration_closed_at === null) {
            $sportsEvent->update([
                'registration_closed_at' => now(),
            ]);
        }

        return back()->with('success', 'Registration has been closed for this event.');
    }

    private function validatedPayload(Request $request): array
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'recurrence' => ['required', 'string', 'max:50'],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'venue.name' => ['required', 'string', 'max:255'],
            'venue.address' => ['required', 'string', 'max:255'],
            'venue.city' => ['required', 'string', 'max:255'],
            'venue.google_maps_url' => ['nullable', 'url', 'max:255'],
        ]);

        return [
            'event' => [
                'name' => $validated['name'],
                'recurrence' => $validated['recurrence'],
                'starts_at' => $validated['starts_at'],
                'ends_at' => $validated['ends_at'] ?? null,
            ],
            'venue' => $validated['venue'],
        ];
    }

    private function eventListPayload(SportsEvent $event): array
    {
        return [
            'id' => $event->id,
            'name' => $event->name,
            'recurrence' => $event->recurrence,
            'starts_at' => $event->starts_at?->toIso8601String(),
            'ends_at' => $event->ends_at?->toIso8601String(),
            'registration_is_open' => $event->registrationIsOpen(),
            'participants_count' => $event->participants_count,
            'participants' => $event->relationLoaded('participants') ? $event->participants->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'email' => $p->email,
            ])->toArray() : [],
            'venue' => [
                'name' => $event->venue->name,
                'address' => $event->venue->address,
                'city' => $event->venue->city,
            ],
        ];
    }
}
