<?php

return [
    /*
    |--------------------------------------------------------------------------
    | OneSignal Configuration
    |--------------------------------------------------------------------------
    |
    | Configure OneSignal push notification service for web push notifications
    | in PWA. Get credentials from OneSignal dashboard.
    |
    */

    'app_id' => env('ONESIGNAL_APP_ID', ''),

    'rest_api_key' => env('ONESIGNAL_REST_API_KEY', ''),

    /*
    |--------------------------------------------------------------------------
    | OneSignal API Base URL
    |--------------------------------------------------------------------------
    |
    | Base URL for OneSignal API endpoints
    |
    */

    'api_url' => 'https://onesignal.com/api/v1',
];
