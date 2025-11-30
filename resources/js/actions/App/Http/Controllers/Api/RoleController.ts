import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\RoleController::selectable
* @see app/Http/Controllers/Api/RoleController.php:96
* @route '/api/v1/roles/selectable'
*/
export const selectable = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: selectable.url(options),
    method: 'get',
})

selectable.definition = {
    methods: ["get","head"],
    url: '/api/v1/roles/selectable',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\RoleController::selectable
* @see app/Http/Controllers/Api/RoleController.php:96
* @route '/api/v1/roles/selectable'
*/
selectable.url = (options?: RouteQueryOptions) => {
    return selectable.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RoleController::selectable
* @see app/Http/Controllers/Api/RoleController.php:96
* @route '/api/v1/roles/selectable'
*/
selectable.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: selectable.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\RoleController::selectable
* @see app/Http/Controllers/Api/RoleController.php:96
* @route '/api/v1/roles/selectable'
*/
selectable.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: selectable.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\RoleController::index
* @see app/Http/Controllers/Api/RoleController.php:17
* @route '/api/v1/roles'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/roles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\RoleController::index
* @see app/Http/Controllers/Api/RoleController.php:17
* @route '/api/v1/roles'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RoleController::index
* @see app/Http/Controllers/Api/RoleController.php:17
* @route '/api/v1/roles'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\RoleController::index
* @see app/Http/Controllers/Api/RoleController.php:17
* @route '/api/v1/roles'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\RoleController::store
* @see app/Http/Controllers/Api/RoleController.php:26
* @route '/api/v1/roles'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/roles',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\RoleController::store
* @see app/Http/Controllers/Api/RoleController.php:26
* @route '/api/v1/roles'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RoleController::store
* @see app/Http/Controllers/Api/RoleController.php:26
* @route '/api/v1/roles'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\RoleController::show
* @see app/Http/Controllers/Api/RoleController.php:44
* @route '/api/v1/roles/{role}'
*/
export const show = (args: { role: string | number } | [role: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/roles/{role}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\RoleController::show
* @see app/Http/Controllers/Api/RoleController.php:44
* @route '/api/v1/roles/{role}'
*/
show.url = (args: { role: string | number } | [role: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

    if (Array.isArray(args)) {
        args = {
            role: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        role: args.role,
    }

    return show.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RoleController::show
* @see app/Http/Controllers/Api/RoleController.php:44
* @route '/api/v1/roles/{role}'
*/
show.get = (args: { role: string | number } | [role: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\RoleController::show
* @see app/Http/Controllers/Api/RoleController.php:44
* @route '/api/v1/roles/{role}'
*/
show.head = (args: { role: string | number } | [role: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\RoleController::update
* @see app/Http/Controllers/Api/RoleController.php:51
* @route '/api/v1/roles/{role}'
*/
export const update = (args: { role: string | number } | [role: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/roles/{role}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\RoleController::update
* @see app/Http/Controllers/Api/RoleController.php:51
* @route '/api/v1/roles/{role}'
*/
update.url = (args: { role: string | number } | [role: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

    if (Array.isArray(args)) {
        args = {
            role: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        role: args.role,
    }

    return update.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RoleController::update
* @see app/Http/Controllers/Api/RoleController.php:51
* @route '/api/v1/roles/{role}'
*/
update.put = (args: { role: string | number } | [role: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\RoleController::update
* @see app/Http/Controllers/Api/RoleController.php:51
* @route '/api/v1/roles/{role}'
*/
update.patch = (args: { role: string | number } | [role: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\RoleController::destroy
* @see app/Http/Controllers/Api/RoleController.php:69
* @route '/api/v1/roles/{role}'
*/
export const destroy = (args: { role: string | number } | [role: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/roles/{role}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\RoleController::destroy
* @see app/Http/Controllers/Api/RoleController.php:69
* @route '/api/v1/roles/{role}'
*/
destroy.url = (args: { role: string | number } | [role: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

    if (Array.isArray(args)) {
        args = {
            role: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        role: args.role,
    }

    return destroy.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RoleController::destroy
* @see app/Http/Controllers/Api/RoleController.php:69
* @route '/api/v1/roles/{role}'
*/
destroy.delete = (args: { role: string | number } | [role: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\RoleController::syncPermissions
* @see app/Http/Controllers/Api/RoleController.php:78
* @route '/api/v1/roles/{id}/sync-permissions'
*/
export const syncPermissions = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncPermissions.url(args, options),
    method: 'post',
})

syncPermissions.definition = {
    methods: ["post"],
    url: '/api/v1/roles/{id}/sync-permissions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\RoleController::syncPermissions
* @see app/Http/Controllers/Api/RoleController.php:78
* @route '/api/v1/roles/{id}/sync-permissions'
*/
syncPermissions.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return syncPermissions.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RoleController::syncPermissions
* @see app/Http/Controllers/Api/RoleController.php:78
* @route '/api/v1/roles/{id}/sync-permissions'
*/
syncPermissions.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncPermissions.url(args, options),
    method: 'post',
})

const RoleController = { selectable, index, store, show, update, destroy, syncPermissions }

export default RoleController