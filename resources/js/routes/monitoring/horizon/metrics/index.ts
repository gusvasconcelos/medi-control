import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Web\Horizon\MetricsController::index
* @see app/Http/Controllers/Web/Horizon/MetricsController.php:18
* @route '/monitoring/horizon/metrics/{type}'
*/
export const index = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/monitoring/horizon/metrics/{type}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\Horizon\MetricsController::index
* @see app/Http/Controllers/Web/Horizon/MetricsController.php:18
* @route '/monitoring/horizon/metrics/{type}'
*/
index.url = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { type: args }
    }

    if (Array.isArray(args)) {
        args = {
            type: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        type: args.type,
    }

    return index.definition.url
            .replace('{type}', parsedArgs.type.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\Horizon\MetricsController::index
* @see app/Http/Controllers/Web/Horizon/MetricsController.php:18
* @route '/monitoring/horizon/metrics/{type}'
*/
index.get = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web\Horizon\MetricsController::index
* @see app/Http/Controllers/Web/Horizon/MetricsController.php:18
* @route '/monitoring/horizon/metrics/{type}'
*/
index.head = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

const metrics = {
    index: Object.assign(index, index),
}

export default metrics