<?php

use App\Http\Controllers\Api\MedicationController;
use Illuminate\Support\Facades\Route;

Route::group([
    'prefix' => 'medications',
    'middleware' => ['auth:sanctum'],
], function () {
    Route::get('/', [MedicationController::class, 'index']);
    Route::get('{id}', [MedicationController::class, 'show']);
    Route::post('/', [MedicationController::class, 'store']);
    Route::put('{id}', [MedicationController::class, 'update']);
    Route::delete('{id}', [MedicationController::class, 'destroy']);
    Route::post('{id}/check-interactions', [MedicationController::class, 'checkInteractions']);
});
