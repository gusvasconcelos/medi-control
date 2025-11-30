import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Web\Metrics\OverviewController::overview
* @see app/Http/Controllers/Web/Metrics/OverviewController.php:16
* @route '/metrics/overview'
*/
export const overview = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: overview.url(options),
    method: 'get',
})

overview.definition = {
    methods: ["get","head"],
    url: '/metrics/overview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\Metrics\OverviewController::overview
* @see app/Http/Controllers/Web/Metrics/OverviewController.php:16
* @route '/metrics/overview'
*/
overview.url = (options?: RouteQueryOptions) => {
    return overview.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\Metrics\OverviewController::overview
* @see app/Http/Controllers/Web/Metrics/OverviewController.php:16
* @route '/metrics/overview'
*/
overview.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: overview.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web\Metrics\OverviewController::overview
* @see app/Http/Controllers/Web/Metrics/OverviewController.php:16
* @route '/metrics/overview'
*/
overview.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: overview.url(options),
    method: 'head',
})

const metrics = {
    overview: Object.assign(overview, overview),
}

export default metrics