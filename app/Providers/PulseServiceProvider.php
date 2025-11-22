<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class PulseServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->gate();
    }

    protected function gate(): void
    {
        Gate::define('viewPulse', function (?User $user) {
            return $user?->hasRole('super-admin');
        });
    }
}
