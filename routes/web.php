<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;

Route::get('/', fn () => Inertia::render('Welcome'))->name('welcome');

Route::get('/login', [LoginController::class, 'create'])->name('login');
Route::get('/register', [RegisterController::class, 'create'])->name('register');
