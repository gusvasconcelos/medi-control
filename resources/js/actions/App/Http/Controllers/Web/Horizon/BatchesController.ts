import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Web\Horizon\BatchesController::index
* @see app/Http/Controllers/Web/Horizon/BatchesController.php:23
* @route '/monitoring/horizon/batches'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/monitoring/horizon/batches',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\Horizon\BatchesController::index
* @see app/Http/Controllers/Web/Horizon/BatchesController.php:23
* @route '/monitoring/horizon/batches'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\Horizon\BatchesController::index
* @see app/Http/Controllers/Web/Horizon/BatchesController.php:23
* @route '/monitoring/horizon/batches'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web\Horizon\BatchesController::index
* @see app/Http/Controllers/Web/Horizon/BatchesController.php:23
* @route '/monitoring/horizon/batches'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Web\Horizon\BatchesController::show
* @see app/Http/Controllers/Web/Horizon/BatchesController.php:37
* @route '/monitoring/horizon/batches/{id}'
*/
export const show = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/monitoring/horizon/batches/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\Horizon\BatchesController::show
* @see app/Http/Controllers/Web/Horizon/BatchesController.php:37
* @route '/monitoring/horizon/batches/{id}'
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
* @see \App\Http\Controllers\Web\Horizon\BatchesController::show
* @see app/Http/Controllers/Web/Horizon/BatchesController.php:37
* @route '/monitoring/horizon/batches/{id}'
*/
show.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web\Horizon\BatchesController::show
* @see app/Http/Controllers/Web/Horizon/BatchesController.php:37
* @route '/monitoring/horizon/batches/{id}'
*/
show.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Web\Horizon\BatchesController::retry
* @see app/Http/Controllers/Web/Horizon/BatchesController.php:54
* @route '/monitoring/horizon/batches/{id}/retry'
*/
export const retry = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retry.url(args, options),
    method: 'post',
})

retry.definition = {
    methods: ["post"],
    url: '/monitoring/horizon/batches/{id}/retry',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Web\Horizon\BatchesController::retry
* @see app/Http/Controllers/Web/Horizon/BatchesController.php:54
* @route '/monitoring/horizon/batches/{id}/retry'
*/
retry.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return retry.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\Horizon\BatchesController::retry
* @see app/Http/Controllers/Web/Horizon/BatchesController.php:54
* @route '/monitoring/horizon/batches/{id}/retry'
*/
retry.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retry.url(args, options),
    method: 'post',
})

const BatchesController = { index, show, retry }

export default BatchesController