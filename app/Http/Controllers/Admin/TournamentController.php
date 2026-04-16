<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SportsEvent;
use App\Services\Tournaments\StartTournament;
use Illuminate\Http\RedirectResponse;

class TournamentController extends Controller
{
    public function __invoke(SportsEvent $sportsEvent, StartTournament $startTournament): RedirectResponse
    {
        $startTournament->handle($sportsEvent);

        return back()->with('success', 'Tournament started successfully.');
    }
}
