import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Api\PermissionController::index
* @see app/Http/Controllers/Api/PermissionController.php:17
* @route '/api/v1/permissions'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/permissions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\PermissionController::index
* @see app/Http/Controllers/Api/PermissionController.php:17
* @route '/api/v1/permissions'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PermissionController::index
* @see app/Http/Controllers/Api/PermissionController.php:17
* @route '/api/v1/permissions'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\PermissionController::index
* @see app/Http/Controllers/Api/PermissionController.php:17
* @route '/api/v1/permissions'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\PermissionController::store
* @see app/Http/Controllers/Api/PermissionController.php:26
* @route '/api/v1/permissions'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/permissions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\PermissionController::store
* @see app/Http/Controllers/Api/PermissionController.php:26
* @route '/api/v1/permissions'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PermissionController::store
* @see app/Http/Controllers/Api/PermissionController.php:26
* @route '/api/v1/permissions'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\PermissionController::show
* @see app/Http/Controllers/Api/PermissionController.php:43
* @route '/api/v1/permissions/{permission}'
*/
export const show = (args: { permission: string | number } | [permission: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/permissions/{permission}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\PermissionController::show
* @see app/Http/Controllers/Api/PermissionController.php:43
* @route '/api/v1/permissions/{permission}'
*/
show.url = (args: { permission: string | number } | [permission: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { permission: args }
    }

    if (Array.isArray(args)) {
        args = {
            permission: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        permission: args.permission,
    }

    return show.definition.url
            .replace('{permission}', parsedArgs.permission.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PermissionController::show
* @see app/Http/Controllers/Api/PermissionController.php:43
* @route '/api/v1/permissions/{permission}'
*/
show.get = (args: { permission: string | number } | [permission: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\PermissionController::show
* @see app/Http/Controllers/Api/PermissionController.php:43
* @route '/api/v1/permissions/{permission}'
*/
show.head = (args: { permission: string | number } | [permission: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\PermissionController::update
* @see app/Http/Controllers/Api/PermissionController.php:50
* @route '/api/v1/permissions/{permission}'
*/
export const update = (args: { permission: string | number } | [permission: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/permissions/{permission}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\PermissionController::update
* @see app/Http/Controllers/Api/PermissionController.php:50
* @route '/api/v1/permissions/{permission}'
*/
update.url = (args: { permission: string | number } | [permission: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { permission: args }
    }

    if (Array.isArray(args)) {
        args = {
            permission: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        permission: args.permission,
    }

    return update.definition.url
            .replace('{permission}', parsedArgs.permission.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PermissionController::update
* @see app/Http/Controllers/Api/PermissionController.php:50
* @route '/api/v1/permissions/{permission}'
*/
update.put = (args: { permission: string | number } | [permission: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\PermissionController::update
* @see app/Http/Controllers/Api/PermissionController.php:50
* @route '/api/v1/permissions/{permission}'
*/
update.patch = (args: { permission: string | number } | [permission: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\PermissionController::destroy
* @see app/Http/Controllers/Api/PermissionController.php:67
* @route '/api/v1/permissions/{permission}'
*/
export const destroy = (args: { permission: string | number } | [permission: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/permissions/{permission}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\PermissionController::destroy
* @see app/Http/Controllers/Api/PermissionController.php:67
* @route '/api/v1/permissions/{permission}'
*/
destroy.url = (args: { permission: string | number } | [permission: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { permission: args }
    }

    if (Array.isArray(args)) {
        args = {
            permission: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        permission: args.permission,
    }

    return destroy.definition.url
            .replace('{permission}', parsedArgs.permission.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PermissionController::destroy
* @see app/Http/Controllers/Api/PermissionController.php:67
* @route '/api/v1/permissions/{permission}'
*/
destroy.delete = (args: { permission: string | number } | [permission: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const permissions = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default permissions