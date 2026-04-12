<?php

namespace App\Http\Controllers;

use App\Models\SportsEvent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class EventRegistrationController extends Controller
{
    /**
     * @throws ValidationException
     */
    public function store(Request $request, SportsEvent $sportsEvent): RedirectResponse
    {
        if (! $sportsEvent->registrationIsOpen()) {
            throw ValidationException::withMessages([
                'registration' => 'Registration for this event has been closed.',
            ]);
        }

        if ($sportsEvent->registrations()->where('user_id', $request->user()->id)->exists()) {
            throw ValidationException::withMessages([
                'registration' => 'You are already registered for this event.',
            ]);
        }

        $sportsEvent->registrations()->create([
            'user_id' => $request->user()->id,
        ]);

        return back()->with('success', 'You have been added to the participant list.');
    }
}
