<?php

use Illuminate\Support\Facades\Route;

Route::group([
    'prefix' => 'v1'
], function () {
    require __DIR__ . '/api/auth.php';
    require __DIR__ . '/api/medications.php';
    require __DIR__ . '/api/user-medications.php';

    Route::file('users');
    Route::file('user-medications');
});
