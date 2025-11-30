import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Web\Pulse\DashboardController::dashboard
* @see app/Http/Controllers/Web/Pulse/DashboardController.php:13
* @route '/monitoring/pulse'
*/
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/monitoring/pulse',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\Pulse\DashboardController::dashboard
* @see app/Http/Controllers/Web/Pulse/DashboardController.php:13
* @route '/monitoring/pulse'
*/
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\Pulse\DashboardController::dashboard
* @see app/Http/Controllers/Web/Pulse/DashboardController.php:13
* @route '/monitoring/pulse'
*/
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web\Pulse\DashboardController::dashboard
* @see app/Http/Controllers/Web/Pulse/DashboardController.php:13
* @route '/monitoring/pulse'
*/
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

const pulse = {
    dashboard: Object.assign(dashboard, dashboard),
}

export default pulse