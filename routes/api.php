<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\PermissionController;

Route::group([
    'prefix' => 'v1'
], function () {
    require __DIR__ . '/api/auth.php';
    require __DIR__ . '/api/medications.php';
    require __DIR__ . '/api/user-medications.php';

    Route::file('users');
    Route::apiResource('users', UserController::class)->only(['index', 'show']);

    Route::middleware(['auth:sanctum'])->group(function () {
        Route::put('users/{id}/roles', [UserController::class, 'updateRoles']);
    });

    // Roles and Permissions (super-admin only)
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::middleware('role:super-admin')->group(function () {
            Route::apiResource('roles', RoleController::class);
            Route::post('roles/{id}/sync-permissions', [RoleController::class, 'syncPermissions']);

            Route::apiResource('permissions', PermissionController::class);
            Route::get('permissions-grouped', [PermissionController::class, 'grouped']);
        });
    });
});
