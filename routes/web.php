<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Broadcast;
use App\Http\Controllers\Web\Auth\LoginController;
use App\Http\Controllers\Web\Auth\RegisterController;
use App\Http\Controllers\Web\Metrics\OverviewController;
use App\Http\Controllers\Web\Caregiver\PatientController;
use App\Http\Controllers\Web\Auth\ResetPasswordController;
use App\Http\Controllers\Web\Auth\ForgotPasswordController;
use App\Http\Controllers\Web\Medication\MedicationController;
use App\Http\Controllers\Web\Horizon\JobsController as HorizonJobsController;
use App\Http\Controllers\Web\Horizon\BatchesController as HorizonBatchesController;
use App\Http\Controllers\Web\Horizon\MetricsController as HorizonMetricsController;
use App\Http\Controllers\Web\Pulse\DashboardController as PulseDashboardController;
use App\Http\Controllers\Web\Horizon\DashboardController as HorizonDashboardController;
use App\Http\Controllers\Web\Horizon\MonitoringController as HorizonMonitoringController;

Route::get('/', fn () => Inertia::render('Welcome'))->name('welcome');

Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store']);

    Route::get('/register', [RegisterController::class, 'create'])->name('register');
    Route::post('/register', [RegisterController::class, 'store']);

    Route::get('/forgot-password', [ForgotPasswordController::class, 'create'])->name('password.request');
    Route::post('/forgot-password', [ForgotPasswordController::class, 'store'])->name('password.email');

    Route::get('/reset-password', [ResetPasswordController::class, 'create'])->name('password.reset');
    Route::post('/reset-password', [ResetPasswordController::class, 'store'])->name('password.update');
});

Route::middleware('auth:sanctum')->group(function () {
    Broadcast::routes();

    Route::prefix('medications')->name('medications.')->group(function () {
        Route::get('/', [MedicationController::class, 'index'])->name('index');
        Route::get('/{medication}', [MedicationController::class, 'show'])->name('show');
        Route::post('/', [MedicationController::class, 'store'])->name('store');
        Route::put('/{medication}', [MedicationController::class, 'update'])->name('update');
        Route::delete('/{medication}', [MedicationController::class, 'destroy'])->name('destroy');
        Route::post(
            '/{medication}/check-interactions',
            [MedicationController::class, 'checkInteractions']
        )->name('check-interactions');
    });

    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');
    Route::get('/select-role', fn () => Inertia::render('Auth/SelectRole'))->name('select-role');
    Route::get('/dashboard', fn () => Inertia::render('Dashboard'))->name('dashboard');
    Route::get('/profile', fn () => Inertia::render('Profile/Index'))->name('profile.index');
    Route::get('/notifications', fn () => Inertia::render('Settings/Notifications/Index'))->name('notifications.index');
    Route::get('/chat', fn () => Inertia::render('Chat/Index'))->name('chat.index');
    Route::get('/metrics/overview', [OverviewController::class, 'create'])->name('metrics.overview');

    Route::get('/my-caregivers', fn () => Inertia::render('Caregivers/Index'))->name('caregivers.index');
    Route::get('/my-patients', fn () => Inertia::render('Patients/Index'))->name('patients.index');
    Route::get('/my-patients/{patientId}', [PatientController::class, 'show'])->name('patients.show');

    Route::get('/reports', fn () => Inertia::render('Reports/Adherence'))->name('reports.adherence');

    Route::get('/users', fn () => Inertia::render('Users/Index'))->name('system.users.index');

    Route::middleware('role:super-admin')->group(function () {
        Route::prefix('settings')->name('settings.')->group(function () {
            Route::get('/roles', fn () => Inertia::render('Settings/Roles/Index'))->name('roles.index');
            Route::get('/permissions', fn () => Inertia::render('Settings/Permissions/Index'))->name('permissions.index');
        });

        Route::prefix('monitoring')->name('monitoring.')->group(function () {
            Route::get('/pulse', [PulseDashboardController::class, 'index'])->name('pulse.dashboard');
            Route::prefix('/horizon')->name('horizon.')->group(function () {
                Route::get('/', [HorizonDashboardController::class, 'index'])->name('dashboard');

                Route::get('/jobs/{status}', [HorizonJobsController::class, 'index'])
                    ->where('status', 'pending|completed|failed|silenced')
                    ->name('jobs.index');
                Route::get('/jobs/show/{id}', [HorizonJobsController::class, 'show'])->name('jobs.show');
                Route::post('/jobs/{id}/retry', [HorizonJobsController::class, 'retry'])->name('jobs.retry');

                Route::get('/batches', [HorizonBatchesController::class, 'index'])->name('batches.index');
                Route::get('/batches/{id}', [HorizonBatchesController::class, 'show'])->name('batches.show');
                Route::post('/batches/{id}/retry', [HorizonBatchesController::class, 'retry'])->name('batches.retry');

                Route::get('/metrics/{type}', [HorizonMetricsController::class, 'index'])
                    ->where('type', 'jobs|queues')
                    ->name('metrics.index');

                Route::get('/monitoring', [HorizonMonitoringController::class, 'index'])->name('monitoring.index');
                Route::post('/monitoring', [HorizonMonitoringController::class, 'store'])->name('monitoring.store');
                Route::get('/monitoring/{tag}', [HorizonMonitoringController::class, 'show'])->name('monitoring.show');
                Route::delete('/monitoring/{tag}', [HorizonMonitoringController::class, 'destroy'])->name('monitoring.destroy');
            });
        });
    });
});
