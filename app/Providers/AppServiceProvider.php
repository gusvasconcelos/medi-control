<?php

namespace App\Providers;

use App\Services\AddUserMedicationService;
use App\Services\Monitoring\UptimeService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(AddUserMedicationService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        UptimeService::initialize();
    }
}
