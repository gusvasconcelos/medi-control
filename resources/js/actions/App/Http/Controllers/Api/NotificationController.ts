import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\NotificationController::index
* @see app/Http/Controllers/Api/NotificationController.php:12
* @route '/api/v1/notifications'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/notifications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\NotificationController::index
* @see app/Http/Controllers/Api/NotificationController.php:12
* @route '/api/v1/notifications'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificationController::index
* @see app/Http/Controllers/Api/NotificationController.php:12
* @route '/api/v1/notifications'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\NotificationController::index
* @see app/Http/Controllers/Api/NotificationController.php:12
* @route '/api/v1/notifications'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\NotificationController::unreadCount
* @see app/Http/Controllers/Api/NotificationController.php:35
* @route '/api/v1/notifications/unread-count'
*/
export const unreadCount = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: unreadCount.url(options),
    method: 'get',
})

unreadCount.definition = {
    methods: ["get","head"],
    url: '/api/v1/notifications/unread-count',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\NotificationController::unreadCount
* @see app/Http/Controllers/Api/NotificationController.php:35
* @route '/api/v1/notifications/unread-count'
*/
unreadCount.url = (options?: RouteQueryOptions) => {
    return unreadCount.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificationController::unreadCount
* @see app/Http/Controllers/Api/NotificationController.php:35
* @route '/api/v1/notifications/unread-count'
*/
unreadCount.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: unreadCount.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\NotificationController::unreadCount
* @see app/Http/Controllers/Api/NotificationController.php:35
* @route '/api/v1/notifications/unread-count'
*/
unreadCount.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: unreadCount.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\NotificationController::recent
* @see app/Http/Controllers/Api/NotificationController.php:78
* @route '/api/v1/notifications/recent'
*/
export const recent = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: recent.url(options),
    method: 'get',
})

recent.definition = {
    methods: ["get","head"],
    url: '/api/v1/notifications/recent',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\NotificationController::recent
* @see app/Http/Controllers/Api/NotificationController.php:78
* @route '/api/v1/notifications/recent'
*/
recent.url = (options?: RouteQueryOptions) => {
    return recent.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificationController::recent
* @see app/Http/Controllers/Api/NotificationController.php:78
* @route '/api/v1/notifications/recent'
*/
recent.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: recent.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\NotificationController::recent
* @see app/Http/Controllers/Api/NotificationController.php:78
* @route '/api/v1/notifications/recent'
*/
recent.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: recent.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\NotificationController::markAsRead
* @see app/Http/Controllers/Api/NotificationController.php:46
* @route '/api/v1/notifications/{id}/read'
*/
export const markAsRead = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: markAsRead.url(args, options),
    method: 'patch',
})

markAsRead.definition = {
    methods: ["patch"],
    url: '/api/v1/notifications/{id}/read',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\NotificationController::markAsRead
* @see app/Http/Controllers/Api/NotificationController.php:46
* @route '/api/v1/notifications/{id}/read'
*/
markAsRead.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return markAsRead.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificationController::markAsRead
* @see app/Http/Controllers/Api/NotificationController.php:46
* @route '/api/v1/notifications/{id}/read'
*/
markAsRead.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: markAsRead.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\NotificationController::markAllAsRead
* @see app/Http/Controllers/Api/NotificationController.php:63
* @route '/api/v1/notifications/mark-all-read'
*/
export const markAllAsRead = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: markAllAsRead.url(options),
    method: 'patch',
})

markAllAsRead.definition = {
    methods: ["patch"],
    url: '/api/v1/notifications/mark-all-read',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\NotificationController::markAllAsRead
* @see app/Http/Controllers/Api/NotificationController.php:63
* @route '/api/v1/notifications/mark-all-read'
*/
markAllAsRead.url = (options?: RouteQueryOptions) => {
    return markAllAsRead.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificationController::markAllAsRead
* @see app/Http/Controllers/Api/NotificationController.php:63
* @route '/api/v1/notifications/mark-all-read'
*/
markAllAsRead.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: markAllAsRead.url(options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\NotificationController::clearAll
* @see app/Http/Controllers/Api/NotificationController.php:90
* @route '/api/v1/notifications/clear-all'
*/
export const clearAll = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: clearAll.url(options),
    method: 'delete',
})

clearAll.definition = {
    methods: ["delete"],
    url: '/api/v1/notifications/clear-all',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\NotificationController::clearAll
* @see app/Http/Controllers/Api/NotificationController.php:90
* @route '/api/v1/notifications/clear-all'
*/
clearAll.url = (options?: RouteQueryOptions) => {
    return clearAll.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificationController::clearAll
* @see app/Http/Controllers/Api/NotificationController.php:90
* @route '/api/v1/notifications/clear-all'
*/
clearAll.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: clearAll.url(options),
    method: 'delete',
})

const NotificationController = { index, unreadCount, recent, markAsRead, markAllAsRead, clearAll }

export default NotificationController