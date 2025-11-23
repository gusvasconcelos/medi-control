<?php

use App\Http\Controllers\Api\CaregiverPatientController;
use Illuminate\Support\Facades\Route;

Route::group([
    'middleware' => ['auth:sanctum'],
], function () {
    Route::get('caregiver-permissions', [CaregiverPatientController::class, 'caregiverPermissions']);

    Route::get('my-caregivers', [CaregiverPatientController::class, 'myCaregivers']);
    Route::post('my-caregivers/invite', [CaregiverPatientController::class, 'inviteCaregiver']);
    Route::put('my-caregivers/{id}/permissions', [CaregiverPatientController::class, 'updatePermissions']);
    Route::delete('my-caregivers/{id}/revoke', [CaregiverPatientController::class, 'revokeAccess']);
    Route::delete('my-caregivers/{id}/cancel', [CaregiverPatientController::class, 'cancelInvitation']);

    Route::get('my-patients', [CaregiverPatientController::class, 'myPatients']);
    Route::get('my-patients/pending', [CaregiverPatientController::class, 'pendingInvitations']);
    Route::post('my-patients/{id}/accept', [CaregiverPatientController::class, 'acceptInvitation']);
    Route::delete('my-patients/{id}/reject', [CaregiverPatientController::class, 'rejectInvitation']);

    Route::get('caregiver-patient/{id}', [CaregiverPatientController::class, 'show']);
});
