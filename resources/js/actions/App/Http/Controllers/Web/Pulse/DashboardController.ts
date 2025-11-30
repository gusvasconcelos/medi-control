import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Web\Pulse\DashboardController::index
* @see app/Http/Controllers/Web/Pulse/DashboardController.php:13
* @route '/monitoring/pulse'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/monitoring/pulse',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\Pulse\DashboardController::index
* @see app/Http/Controllers/Web/Pulse/DashboardController.php:13
* @route '/monitoring/pulse'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\Pulse\DashboardController::index
* @see app/Http/Controllers/Web/Pulse/DashboardController.php:13
* @route '/monitoring/pulse'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web\Pulse\DashboardController::index
* @see app/Http/Controllers/Web/Pulse/DashboardController.php:13
* @route '/monitoring/pulse'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

const DashboardController = { index }

export default DashboardController