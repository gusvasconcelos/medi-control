<?php

declare(strict_types=1);

namespace App\Providers;

use App\Events\UserMedicationCreated;
use App\Listeners\CheckMedicationInteractions;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

final class EventServiceProvider extends ServiceProvider
{
    /**
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        UserMedicationCreated::class => [
            CheckMedicationInteractions::class,
        ],
    ];

    public function boot(): void
    {
        //
    }

    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
