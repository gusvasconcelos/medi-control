<?php

namespace App\Providers;

use App\Packages\OpenAI\Contracts\OpenAIClientInterface;
use App\Packages\OpenAI\OpenAIClient;
use Illuminate\Support\ServiceProvider;

final class OpenAIServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(OpenAIClientInterface::class, OpenAIClient::class);
    }
}
