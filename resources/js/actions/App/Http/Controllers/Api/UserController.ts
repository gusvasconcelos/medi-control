import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\UserController::index
* @see app/Http/Controllers/Api/UserController.php:19
* @route '/api/v1/users'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\UserController::index
* @see app/Http/Controllers/Api/UserController.php:19
* @route '/api/v1/users'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserController::index
* @see app/Http/Controllers/Api/UserController.php:19
* @route '/api/v1/users'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\UserController::index
* @see app/Http/Controllers/Api/UserController.php:19
* @route '/api/v1/users'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\UserController::show
* @see app/Http/Controllers/Api/UserController.php:28
* @route '/api/v1/users/{user}'
*/
export const show = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/users/{user}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\UserController::show
* @see app/Http/Controllers/Api/UserController.php:28
* @route '/api/v1/users/{user}'
*/
show.url = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: args.user,
    }

    return show.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserController::show
* @see app/Http/Controllers/Api/UserController.php:28
* @route '/api/v1/users/{user}'
*/
show.get = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\UserController::show
* @see app/Http/Controllers/Api/UserController.php:28
* @route '/api/v1/users/{user}'
*/
show.head = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\UserController::updateRoles
* @see app/Http/Controllers/Api/UserController.php:35
* @route '/api/v1/users/{id}/roles'
*/
export const updateRoles = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateRoles.url(args, options),
    method: 'put',
})

updateRoles.definition = {
    methods: ["put"],
    url: '/api/v1/users/{id}/roles',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\UserController::updateRoles
* @see app/Http/Controllers/Api/UserController.php:35
* @route '/api/v1/users/{id}/roles'
*/
updateRoles.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateRoles.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserController::updateRoles
* @see app/Http/Controllers/Api/UserController.php:35
* @route '/api/v1/users/{id}/roles'
*/
updateRoles.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateRoles.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\UserController::selectRole
* @see app/Http/Controllers/Api/UserController.php:53
* @route '/api/v1/users/me/select-role'
*/
export const selectRole = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: selectRole.url(options),
    method: 'post',
})

selectRole.definition = {
    methods: ["post"],
    url: '/api/v1/users/me/select-role',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\UserController::selectRole
* @see app/Http/Controllers/Api/UserController.php:53
* @route '/api/v1/users/me/select-role'
*/
selectRole.url = (options?: RouteQueryOptions) => {
    return selectRole.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserController::selectRole
* @see app/Http/Controllers/Api/UserController.php:53
* @route '/api/v1/users/me/select-role'
*/
selectRole.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: selectRole.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\UserController::profile
* @see app/Http/Controllers/Api/UserController.php:76
* @route '/api/v1/users/me/profile'
*/
export const profile = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: profile.url(options),
    method: 'get',
})

profile.definition = {
    methods: ["get","head"],
    url: '/api/v1/users/me/profile',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\UserController::profile
* @see app/Http/Controllers/Api/UserController.php:76
* @route '/api/v1/users/me/profile'
*/
profile.url = (options?: RouteQueryOptions) => {
    return profile.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserController::profile
* @see app/Http/Controllers/Api/UserController.php:76
* @route '/api/v1/users/me/profile'
*/
profile.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: profile.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\UserController::profile
* @see app/Http/Controllers/Api/UserController.php:76
* @route '/api/v1/users/me/profile'
*/
profile.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: profile.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\UserController::updateProfile
* @see app/Http/Controllers/Api/UserController.php:87
* @route '/api/v1/users/me/profile'
*/
export const updateProfile = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateProfile.url(options),
    method: 'put',
})

updateProfile.definition = {
    methods: ["put"],
    url: '/api/v1/users/me/profile',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\UserController::updateProfile
* @see app/Http/Controllers/Api/UserController.php:87
* @route '/api/v1/users/me/profile'
*/
updateProfile.url = (options?: RouteQueryOptions) => {
    return updateProfile.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserController::updateProfile
* @see app/Http/Controllers/Api/UserController.php:87
* @route '/api/v1/users/me/profile'
*/
updateProfile.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateProfile.url(options),
    method: 'put',
})

const UserController = { index, show, updateRoles, selectRole, profile, updateProfile }

export default UserController