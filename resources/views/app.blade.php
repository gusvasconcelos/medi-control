<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title inertia>{{ config('app.name', 'MediControl') }}</title>

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="alternate icon" href="/favicon.ico">

    <!-- PWA Manifest -->
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#0D7FFF">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="MediControl">

    <!-- Preload critical SVGs -->
    <link rel="preload" href="/storage/logo.svg" as="image" type="image/svg+xml" />
    <link rel="preload" href="/storage/icon.svg" as="image" type="image/svg+xml" />
    <link rel="preload" href="/favicon.svg" as="image" type="image/svg+xml" />

    <!-- Preload critical Dashboard images -->
    <link rel="preload" href="/storage/medication.webp" as="image" type="image/png" />
    <link rel="preload" href="/storage/checkmark.webp" as="image" type="image/png" />
    <link rel="preload" href="/storage/analytics.webp" as="image" type="image/png" />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600&display=swap" rel="stylesheet" />

    <!-- OneSignal SDK -->
    <script>
        window.OneSignalDeferred = window.OneSignalDeferred || [];
        OneSignalDeferred.push(function(OneSignal) {
            OneSignal.init({
                appId: "{{ env('ONESIGNAL_APP_ID') }}",
                allowLocalhostAsSecureOrigin: {{ env('APP_ENV') === 'local' ? 'true' : 'false' }},
                serviceWorkerParam: {
                    scope: '/'
                },
                serviceWorkerPath: 'OneSignalSDKWorker.js'
            });
        });
    </script>
    <script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" defer></script>

    <!-- Scripts -->
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
