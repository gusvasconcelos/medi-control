<?php

use App\Http\Controllers\Api\MedicationController;
use Illuminate\Support\Facades\Route;

Route::group([
    'prefix' => 'medications',
    'middleware' => ['api', 'jwt'],
], function () {
    Route::get('search', [MedicationController::class, 'search']);
});
