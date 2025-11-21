<?php

use App\Http\Controllers\Api\MedicationController;
use Illuminate\Support\Facades\Route;

Route::group([
    'prefix' => 'medications',
    'middleware' => ['auth:sanctum'],
], function () {
    Route::get('search', [MedicationController::class, 'search']);
    Route::post('{id}/check-interactions', [MedicationController::class, 'checkInteractions']);
});
