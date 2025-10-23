<?php

use App\Http\Controllers\Api\MedicationLogController;
use App\Http\Controllers\Api\UserMedicationController;
use Illuminate\Support\Facades\Route;

Route::group([
    'prefix' => 'user-medications',
    'middleware' => ['api', 'jwt'],
], function () {
    Route::get('medications/search', [UserMedicationController::class, 'search']);
    Route::get('indicators', [UserMedicationController::class, 'indicators']);
    Route::get('/', [UserMedicationController::class, 'index']);
    Route::post('/', [UserMedicationController::class, 'store']);
    Route::get('/{id}', [UserMedicationController::class, 'show']);
    Route::put('/{id}', [UserMedicationController::class, 'update']);
    Route::delete('/{id}', [UserMedicationController::class, 'destroy']);

    // Medication logs
    Route::post('/{id}/log-taken', [MedicationLogController::class, 'logTaken']);
});
