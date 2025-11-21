<?php

return [
    'discord' => [
        'webhook_url' => env('DISCORD_MONITORING_WEBHOOK_URL'),
        'enabled' => env('DISCORD_MONITORING_ENABLED', true),
    ],
];
