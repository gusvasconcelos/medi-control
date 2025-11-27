// OneSignal Web SDK initialization
window.OneSignalDeferred = window.OneSignalDeferred || [];

window.OneSignalDeferred.push(async function(OneSignal) {
    // This will be called when OneSignal is ready
    console.log('OneSignal SDK loaded and ready');
});

// Load OneSignal SDK
(function() {
    var script = document.createElement('script');
    script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
    script.async = true;
    script.defer = true;

    script.onerror = function() {
        console.error('Failed to load OneSignal from CDN, using fallback...');
        // You can add fallback logic here if needed
    };

    document.head.appendChild(script);
})();
