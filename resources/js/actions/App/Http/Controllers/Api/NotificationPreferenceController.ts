import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\NotificationPreferenceController::show
* @see app/Http/Controllers/Api/NotificationPreferenceController.php:12
* @route '/api/v1/notification-preferences'
*/
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/notification-preferences',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\NotificationPreferenceController::show
* @see app/Http/Controllers/Api/NotificationPreferenceController.php:12
* @route '/api/v1/notification-preferences'
*/
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificationPreferenceController::show
* @see app/Http/Controllers/Api/NotificationPreferenceController.php:12
* @route '/api/v1/notification-preferences'
*/
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\NotificationPreferenceController::show
* @see app/Http/Controllers/Api/NotificationPreferenceController.php:12
* @route '/api/v1/notification-preferences'
*/
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\NotificationPreferenceController::update
* @see app/Http/Controllers/Api/NotificationPreferenceController.php:32
* @route '/api/v1/notification-preferences'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/v1/notification-preferences',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\NotificationPreferenceController::update
* @see app/Http/Controllers/Api/NotificationPreferenceController.php:32
* @route '/api/v1/notification-preferences'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificationPreferenceController::update
* @see app/Http/Controllers/Api/NotificationPreferenceController.php:32
* @route '/api/v1/notification-preferences'
*/
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

const NotificationPreferenceController = { show, update }

export default NotificationPreferenceController