<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Users management (Inertia + React)
    // Protect with policy gate: only users who pass UserPolicy::manage may access these routes.
    Route::middleware(['can:manage,App\\Models\\User'])->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::get('/users/logins', [App\Http\Controllers\LoginLogController::class, 'index'])->name('users.logins');
        Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
        Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    });
});

// Temporary debug route: returns current authenticated user (auth required).
Route::get('/debug/whoami', function () {
    return auth()->user();
})->middleware('auth');

require __DIR__.'/settings.php';
