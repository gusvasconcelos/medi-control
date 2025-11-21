<?php

use App\Http\Controllers\Api\UserMedicationController;
use App\Http\Controllers\Api\MedicationLogController;
use Illuminate\Support\Facades\Route;

Route::group([
    'middleware' => ['auth:sanctum'],
], function () {
    Route::get('user-medications/indicators', [UserMedicationController::class, 'indicators']);
    Route::get('user-medications', [UserMedicationController::class, 'getUserMedications']);
    Route::post('user-medications', [UserMedicationController::class, 'store']);
    Route::get('user-medications/{id}', [UserMedicationController::class, 'show']);
    Route::put('user-medications/{id}', [UserMedicationController::class, 'update']);
    Route::delete('user-medications/{id}', [UserMedicationController::class, 'destroy']);
    Route::file('user-medications');

    // Medication logs
    Route::post('user-medications/{id}/log-taken', [MedicationLogController::class, 'logTaken']);
});
