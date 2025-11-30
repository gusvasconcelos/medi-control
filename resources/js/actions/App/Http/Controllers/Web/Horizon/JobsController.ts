import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Web\Horizon\JobsController::index
* @see app/Http/Controllers/Web/Horizon/JobsController.php:22
* @route '/monitoring/horizon/jobs/{status}'
*/
export const index = (args: { status: string | number } | [status: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/monitoring/horizon/jobs/{status}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\Horizon\JobsController::index
* @see app/Http/Controllers/Web/Horizon/JobsController.php:22
* @route '/monitoring/horizon/jobs/{status}'
*/
index.url = (args: { status: string | number } | [status: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { status: args }
    }

    if (Array.isArray(args)) {
        args = {
            status: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        status: args.status,
    }

    return index.definition.url
            .replace('{status}', parsedArgs.status.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\Horizon\JobsController::index
* @see app/Http/Controllers/Web/Horizon/JobsController.php:22
* @route '/monitoring/horizon/jobs/{status}'
*/
index.get = (args: { status: string | number } | [status: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web\Horizon\JobsController::index
* @see app/Http/Controllers/Web/Horizon/JobsController.php:22
* @route '/monitoring/horizon/jobs/{status}'
*/
index.head = (args: { status: string | number } | [status: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Web\Horizon\JobsController::show
* @see app/Http/Controllers/Web/Horizon/JobsController.php:44
* @route '/monitoring/horizon/jobs/show/{id}'
*/
export const show = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/monitoring/horizon/jobs/show/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\Horizon\JobsController::show
* @see app/Http/Controllers/Web/Horizon/JobsController.php:44
* @route '/monitoring/horizon/jobs/show/{id}'
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
* @see \App\Http\Controllers\Web\Horizon\JobsController::show
* @see app/Http/Controllers/Web/Horizon/JobsController.php:44
* @route '/monitoring/horizon/jobs/show/{id}'
*/
show.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web\Horizon\JobsController::show
* @see app/Http/Controllers/Web/Horizon/JobsController.php:44
* @route '/monitoring/horizon/jobs/show/{id}'
*/
show.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Web\Horizon\JobsController::retry
* @see app/Http/Controllers/Web/Horizon/JobsController.php:55
* @route '/monitoring/horizon/jobs/{id}/retry'
*/
export const retry = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retry.url(args, options),
    method: 'post',
})

retry.definition = {
    methods: ["post"],
    url: '/monitoring/horizon/jobs/{id}/retry',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Web\Horizon\JobsController::retry
* @see app/Http/Controllers/Web/Horizon/JobsController.php:55
* @route '/monitoring/horizon/jobs/{id}/retry'
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
* @see \App\Http\Controllers\Web\Horizon\JobsController::retry
* @see app/Http/Controllers/Web/Horizon/JobsController.php:55
* @route '/monitoring/horizon/jobs/{id}/retry'
*/
retry.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retry.url(args, options),
    method: 'post',
})

const JobsController = { index, show, retry }

export default JobsController