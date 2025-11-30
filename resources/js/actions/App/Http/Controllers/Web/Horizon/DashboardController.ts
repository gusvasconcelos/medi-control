import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Web\Horizon\DashboardController::index
* @see app/Http/Controllers/Web/Horizon/DashboardController.php:28
* @route '/monitoring/horizon'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/monitoring/horizon',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\Horizon\DashboardController::index
* @see app/Http/Controllers/Web/Horizon/DashboardController.php:28
* @route '/monitoring/horizon'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\Horizon\DashboardController::index
* @see app/Http/Controllers/Web/Horizon/DashboardController.php:28
* @route '/monitoring/horizon'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web\Horizon\DashboardController::index
* @see app/Http/Controllers/Web/Horizon/DashboardController.php:28
* @route '/monitoring/horizon'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

const DashboardController = { index }

export default DashboardController