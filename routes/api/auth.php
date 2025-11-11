<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ForgotPasswordController;
use App\Http\Controllers\Api\ResetPasswordController;
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

    Route::post('forgot-password', [ForgotPasswordController::class, 'sendResetLink'])->withoutMiddleware(['jwt']);
    Route::post('reset-password', [ResetPasswordController::class, 'resetPassword'])->withoutMiddleware(['jwt']);
});
