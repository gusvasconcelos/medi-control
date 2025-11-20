<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Web\Auth\LoginController;
use App\Http\Controllers\Web\Auth\RegisterController;
use App\Http\Controllers\Web\Auth\ForgotPasswordController;
use App\Http\Controllers\Web\Auth\ResetPasswordController;

Route::get('/', fn () => Inertia::render('Welcome'))->name('welcome');

Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store']);

    Route::get('/register', [RegisterController::class, 'create'])->name('register');
    Route::post('/register', [RegisterController::class, 'store']);

    Route::get('/forgot-password', [ForgotPasswordController::class, 'create'])->name('password.request');
    Route::post('/forgot-password', [ForgotPasswordController::class, 'store'])->name('password.email');

    Route::get('/reset-password', [ResetPasswordController::class, 'create'])->name('password.reset');
    Route::post('/reset-password', [ResetPasswordController::class, 'store'])->name('password.update');
});

// Remove auth:api middleware from Inertia pages
// Frontend will handle JWT authentication via useAuth hook
Route::get('/dashboard', fn () => Inertia::render('MedicationsDashboard'))->name('dashboard');
