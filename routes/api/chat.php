<?php

use App\Http\Controllers\Api\ChatController;
use Illuminate\Support\Facades\Route;

Route::prefix('chat')->middleware('auth:sanctum')->group(function () {
    Route::get('/session', [ChatController::class, 'show']);
    Route::get('/messages', [ChatController::class, 'index']);
    Route::post('/messages', [ChatController::class, 'store']);
    Route::post('/messages/stream', [ChatController::class, 'streamMessage'])
        ->middleware(\App\Http\Middleware\DisableOutputBuffering::class);
    Route::delete('/history', [ChatController::class, 'destroy']);
    Route::get('/suggested-prompts', [ChatController::class, 'suggestedPrompts']);
});
