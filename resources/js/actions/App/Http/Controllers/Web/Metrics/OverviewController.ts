import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Web\Metrics\OverviewController::create
* @see app/Http/Controllers/Web/Metrics/OverviewController.php:16
* @route '/metrics/overview'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/metrics/overview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\Metrics\OverviewController::create
* @see app/Http/Controllers/Web/Metrics/OverviewController.php:16
* @route '/metrics/overview'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\Metrics\OverviewController::create
* @see app/Http/Controllers/Web/Metrics/OverviewController.php:16
* @route '/metrics/overview'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web\Metrics\OverviewController::create
* @see app/Http/Controllers/Web/Metrics/OverviewController.php:16
* @route '/metrics/overview'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

const OverviewController = { create }

export default OverviewController