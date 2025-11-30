import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
import jobs from './jobs'
import batches from './batches'
import metrics from './metrics'
import monitoring from './monitoring'
/**
* @see \App\Http\Controllers\Web\Horizon\DashboardController::dashboard
* @see app/Http/Controllers/Web/Horizon/DashboardController.php:28
* @route '/monitoring/horizon'
*/
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/monitoring/horizon',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\Horizon\DashboardController::dashboard
* @see app/Http/Controllers/Web/Horizon/DashboardController.php:28
* @route '/monitoring/horizon'
*/
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\Horizon\DashboardController::dashboard
* @see app/Http/Controllers/Web/Horizon/DashboardController.php:28
* @route '/monitoring/horizon'
*/
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web\Horizon\DashboardController::dashboard
* @see app/Http/Controllers/Web/Horizon/DashboardController.php:28
* @route '/monitoring/horizon'
*/
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

const horizon = {
    dashboard: Object.assign(dashboard, dashboard),
    jobs: Object.assign(jobs, jobs),
    batches: Object.assign(batches, batches),
    metrics: Object.assign(metrics, metrics),
    monitoring: Object.assign(monitoring, monitoring),
}

export default horizon