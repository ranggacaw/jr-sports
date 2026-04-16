<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TournamentMatch;
use App\Services\Tournaments\RecordMatchScore;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class MatchScoreController extends Controller
{
    public function __invoke(Request $request, TournamentMatch $match, RecordMatchScore $recordMatchScore): RedirectResponse
    {
        $validated = $request->validate([
            'g1_p1_score' => ['required', 'integer', 'min:0'],
            'g1_p2_score' => ['required', 'integer', 'min:0'],
            'g2_p1_score' => ['required', 'integer', 'min:0'],
            'g2_p2_score' => ['required', 'integer', 'min:0'],
            'g3_p1_score' => ['nullable', 'integer', 'min:0'],
            'g3_p2_score' => ['nullable', 'integer', 'min:0'],
        ]);

        $recordMatchScore->handle(
            $match,
            $validated
        );

        return back()->with('success', 'Match score saved successfully.');
    }
}
