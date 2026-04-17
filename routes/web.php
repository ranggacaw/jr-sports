<?php

use App\Http\Controllers\Admin\EventController as AdminEventController;
use App\Http\Controllers\Admin\MatchScoreController;
use App\Http\Controllers\Admin\TournamentController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EventRegistrationController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', [EventController::class, 'index'])->name('events.index');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [EventController::class, 'dashboard'])->name('dashboard');
    Route::get('/events/{sportsEvent}', [EventController::class, 'show'])->name('events.show');
    Route::post('/events/{sportsEvent}/registrations', [EventRegistrationController::class, 'store'])
        ->name('events.registrations.store');
});

Route::middleware(['auth', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/events', [AdminEventController::class, 'index'])->name('events.index');
        Route::get('/events/create', [AdminEventController::class, 'create'])->name('events.create');
        Route::post('/events', [AdminEventController::class, 'store'])->name('events.store');
        Route::get('/events/{sportsEvent}', [AdminEventController::class, 'show'])->name('events.show');
        Route::get('/events/{sportsEvent}/edit', [AdminEventController::class, 'edit'])->name('events.edit');
        Route::put('/events/{sportsEvent}', [AdminEventController::class, 'update'])->name('events.update');
        Route::patch('/events/{sportsEvent}/close-registration', [AdminEventController::class, 'closeRegistration'])
            ->name('events.close-registration');
        Route::post('/events/{sportsEvent}/registrations', [AdminEventController::class, 'addRegistration'])
            ->name('events.registrations.store');
        Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
        Route::get('/users/create', [AdminUserController::class, 'create'])->name('users.create');
        Route::post('/users', [AdminUserController::class, 'store'])->name('users.store');
        Route::get('/users/{user}/edit', [AdminUserController::class, 'edit'])->name('users.edit');
        Route::put('/users/{user}', [AdminUserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');
        Route::post('/events/{sportsEvent}/tournament/start', TournamentController::class)
            ->name('events.tournament.start');
        Route::post('/matches/{match}/score', MatchScoreController::class)
            ->name('matches.score');
    });

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
