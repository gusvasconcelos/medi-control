import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Web\Horizon\MonitoringController::index
* @see app/Http/Controllers/Web/Horizon/MonitoringController.php:21
* @route '/monitoring/horizon/monitoring'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/monitoring/horizon/monitoring',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\Horizon\MonitoringController::index
* @see app/Http/Controllers/Web/Horizon/MonitoringController.php:21
* @route '/monitoring/horizon/monitoring'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\Horizon\MonitoringController::index
* @see app/Http/Controllers/Web/Horizon/MonitoringController.php:21
* @route '/monitoring/horizon/monitoring'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web\Horizon\MonitoringController::index
* @see app/Http/Controllers/Web/Horizon/MonitoringController.php:21
* @route '/monitoring/horizon/monitoring'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Web\Horizon\MonitoringController::store
* @see app/Http/Controllers/Web/Horizon/MonitoringController.php:35
* @route '/monitoring/horizon/monitoring'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/monitoring/horizon/monitoring',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Web\Horizon\MonitoringController::store
* @see app/Http/Controllers/Web/Horizon/MonitoringController.php:35
* @route '/monitoring/horizon/monitoring'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\Horizon\MonitoringController::store
* @see app/Http/Controllers/Web/Horizon/MonitoringController.php:35
* @route '/monitoring/horizon/monitoring'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Web\Horizon\MonitoringController::show
* @see app/Http/Controllers/Web/Horizon/MonitoringController.php:46
* @route '/monitoring/horizon/monitoring/{tag}'
*/
export const show = (args: { tag: string | number } | [tag: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/monitoring/horizon/monitoring/{tag}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\Horizon\MonitoringController::show
* @see app/Http/Controllers/Web/Horizon/MonitoringController.php:46
* @route '/monitoring/horizon/monitoring/{tag}'
*/
show.url = (args: { tag: string | number } | [tag: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tag: args }
    }

    if (Array.isArray(args)) {
        args = {
            tag: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        tag: args.tag,
    }

    return show.definition.url
            .replace('{tag}', parsedArgs.tag.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\Horizon\MonitoringController::show
* @see app/Http/Controllers/Web/Horizon/MonitoringController.php:46
* @route '/monitoring/horizon/monitoring/{tag}'
*/
show.get = (args: { tag: string | number } | [tag: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web\Horizon\MonitoringController::show
* @see app/Http/Controllers/Web/Horizon/MonitoringController.php:46
* @route '/monitoring/horizon/monitoring/{tag}'
*/
show.head = (args: { tag: string | number } | [tag: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Web\Horizon\MonitoringController::destroy
* @see app/Http/Controllers/Web/Horizon/MonitoringController.php:67
* @route '/monitoring/horizon/monitoring/{tag}'
*/
export const destroy = (args: { tag: string | number } | [tag: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/monitoring/horizon/monitoring/{tag}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Web\Horizon\MonitoringController::destroy
* @see app/Http/Controllers/Web/Horizon/MonitoringController.php:67
* @route '/monitoring/horizon/monitoring/{tag}'
*/
destroy.url = (args: { tag: string | number } | [tag: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tag: args }
    }

    if (Array.isArray(args)) {
        args = {
            tag: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        tag: args.tag,
    }

    return destroy.definition.url
            .replace('{tag}', parsedArgs.tag.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\Horizon\MonitoringController::destroy
* @see app/Http/Controllers/Web/Horizon/MonitoringController.php:67
* @route '/monitoring/horizon/monitoring/{tag}'
*/
destroy.delete = (args: { tag: string | number } | [tag: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const MonitoringController = { index, store, show, destroy }

export default MonitoringController