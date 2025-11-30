import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\OneSignalController::registerPlayerId
* @see app/Http/Controllers/Api/OneSignalController.php:18
* @route '/api/v1/onesignal/register'
*/
export const registerPlayerId = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registerPlayerId.url(options),
    method: 'post',
})

registerPlayerId.definition = {
    methods: ["post"],
    url: '/api/v1/onesignal/register',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\OneSignalController::registerPlayerId
* @see app/Http/Controllers/Api/OneSignalController.php:18
* @route '/api/v1/onesignal/register'
*/
registerPlayerId.url = (options?: RouteQueryOptions) => {
    return registerPlayerId.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\OneSignalController::registerPlayerId
* @see app/Http/Controllers/Api/OneSignalController.php:18
* @route '/api/v1/onesignal/register'
*/
registerPlayerId.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registerPlayerId.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\OneSignalController::unregisterPlayerId
* @see app/Http/Controllers/Api/OneSignalController.php:65
* @route '/api/v1/onesignal/unregister'
*/
export const unregisterPlayerId = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: unregisterPlayerId.url(options),
    method: 'post',
})

unregisterPlayerId.definition = {
    methods: ["post"],
    url: '/api/v1/onesignal/unregister',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\OneSignalController::unregisterPlayerId
* @see app/Http/Controllers/Api/OneSignalController.php:65
* @route '/api/v1/onesignal/unregister'
*/
unregisterPlayerId.url = (options?: RouteQueryOptions) => {
    return unregisterPlayerId.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\OneSignalController::unregisterPlayerId
* @see app/Http/Controllers/Api/OneSignalController.php:65
* @route '/api/v1/onesignal/unregister'
*/
unregisterPlayerId.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: unregisterPlayerId.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\OneSignalController::getDevices
* @see app/Http/Controllers/Api/OneSignalController.php:102
* @route '/api/v1/onesignal/devices'
*/
export const getDevices = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getDevices.url(options),
    method: 'get',
})

getDevices.definition = {
    methods: ["get","head"],
    url: '/api/v1/onesignal/devices',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\OneSignalController::getDevices
* @see app/Http/Controllers/Api/OneSignalController.php:102
* @route '/api/v1/onesignal/devices'
*/
getDevices.url = (options?: RouteQueryOptions) => {
    return getDevices.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\OneSignalController::getDevices
* @see app/Http/Controllers/Api/OneSignalController.php:102
* @route '/api/v1/onesignal/devices'
*/
getDevices.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getDevices.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\OneSignalController::getDevices
* @see app/Http/Controllers/Api/OneSignalController.php:102
* @route '/api/v1/onesignal/devices'
*/
getDevices.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getDevices.url(options),
    method: 'head',
})

const OneSignalController = { registerPlayerId, unregisterPlayerId, getDevices }

export default OneSignalController