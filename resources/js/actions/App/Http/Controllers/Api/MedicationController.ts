import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\MedicationController::index
* @see app/Http/Controllers/Api/MedicationController.php:20
* @route '/api/v1/medications'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/medications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\MedicationController::index
* @see app/Http/Controllers/Api/MedicationController.php:20
* @route '/api/v1/medications'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\MedicationController::index
* @see app/Http/Controllers/Api/MedicationController.php:20
* @route '/api/v1/medications'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\MedicationController::index
* @see app/Http/Controllers/Api/MedicationController.php:20
* @route '/api/v1/medications'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\MedicationController::show
* @see app/Http/Controllers/Api/MedicationController.php:29
* @route '/api/v1/medications/{id}'
*/
export const show = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/medications/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\MedicationController::show
* @see app/Http/Controllers/Api/MedicationController.php:29
* @route '/api/v1/medications/{id}'
*/
show.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\MedicationController::show
* @see app/Http/Controllers/Api/MedicationController.php:29
* @route '/api/v1/medications/{id}'
*/
show.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\MedicationController::show
* @see app/Http/Controllers/Api/MedicationController.php:29
* @route '/api/v1/medications/{id}'
*/
show.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\MedicationController::store
* @see app/Http/Controllers/Api/MedicationController.php:36
* @route '/api/v1/medications'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/medications',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\MedicationController::store
* @see app/Http/Controllers/Api/MedicationController.php:36
* @route '/api/v1/medications'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\MedicationController::store
* @see app/Http/Controllers/Api/MedicationController.php:36
* @route '/api/v1/medications'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\MedicationController::update
* @see app/Http/Controllers/Api/MedicationController.php:45
* @route '/api/v1/medications/{id}'
*/
export const update = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/v1/medications/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\MedicationController::update
* @see app/Http/Controllers/Api/MedicationController.php:45
* @route '/api/v1/medications/{id}'
*/
update.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\MedicationController::update
* @see app/Http/Controllers/Api/MedicationController.php:45
* @route '/api/v1/medications/{id}'
*/
update.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\MedicationController::destroy
* @see app/Http/Controllers/Api/MedicationController.php:54
* @route '/api/v1/medications/{id}'
*/
export const destroy = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/medications/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\MedicationController::destroy
* @see app/Http/Controllers/Api/MedicationController.php:54
* @route '/api/v1/medications/{id}'
*/
destroy.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\MedicationController::destroy
* @see app/Http/Controllers/Api/MedicationController.php:54
* @route '/api/v1/medications/{id}'
*/
destroy.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\MedicationController::checkInteractions
* @see app/Http/Controllers/Api/MedicationController.php:61
* @route '/api/v1/medications/{id}/check-interactions'
*/
export const checkInteractions = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkInteractions.url(args, options),
    method: 'post',
})

checkInteractions.definition = {
    methods: ["post"],
    url: '/api/v1/medications/{id}/check-interactions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\MedicationController::checkInteractions
* @see app/Http/Controllers/Api/MedicationController.php:61
* @route '/api/v1/medications/{id}/check-interactions'
*/
checkInteractions.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return checkInteractions.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\MedicationController::checkInteractions
* @see app/Http/Controllers/Api/MedicationController.php:61
* @route '/api/v1/medications/{id}/check-interactions'
*/
checkInteractions.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkInteractions.url(args, options),
    method: 'post',
})

const MedicationController = { index, show, store, update, destroy, checkInteractions }

export default MedicationController