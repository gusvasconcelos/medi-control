<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

Route::group([
    'prefix' => 'auth',
    'middleware' => ['api', 'jwt'],
], function () {
    Route::post('register', [AuthController::class, 'register'])->withoutMiddleware(['jwt']);
    Route::post('login', [AuthController::class, 'login'])->withoutMiddleware(['jwt']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::get('me', [AuthController::class, 'me']);
});
