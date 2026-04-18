<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SportsEvent;
use App\Models\Tournament;
use App\Services\Tournaments\StartTournament;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;


class TournamentController extends Controller
{
    public function __invoke(Request $request, SportsEvent $sportsEvent, StartTournament $startTournament): RedirectResponse
    {
        $validated = $request->validate([
            'format' => ['required', 'string', Rule::in([Tournament::FORMAT_SINGLES, Tournament::FORMAT_DOUBLES])],
            'entrant_count' => ['required', 'integer', 'min:2'],
            'active_registration_ids' => ['exclude_unless:format,'.Tournament::FORMAT_SINGLES, 'nullable', 'array'],
            'active_registration_ids.*' => ['exclude_unless:format,'.Tournament::FORMAT_SINGLES, 'integer'],
            'reserve_registration_ids' => ['nullable', 'array'],
            'reserve_registration_ids.*' => ['integer'],
            'teams' => ['exclude_unless:format,'.Tournament::FORMAT_DOUBLES, 'nullable', 'array'],
            'teams.*.name' => ['exclude_unless:format,'.Tournament::FORMAT_DOUBLES, 'nullable', 'string', 'max:255'],
            'teams.*.member_registration_ids' => ['exclude_unless:format,'.Tournament::FORMAT_DOUBLES, 'nullable', 'array'],
            'teams.*.member_registration_ids.*' => ['exclude_unless:format,'.Tournament::FORMAT_DOUBLES, 'integer'],
        ]);

        $startTournament->handle($sportsEvent, $validated);

        return back()->with('success', 'Tournament started successfully.');
    }
}
