import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Web\Auth\ResetPasswordController::create
* @see app/Http/Controllers/Web/Auth/ResetPasswordController.php:20
* @route '/reset-password'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/reset-password',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\Auth\ResetPasswordController::create
* @see app/Http/Controllers/Web/Auth/ResetPasswordController.php:20
* @route '/reset-password'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\Auth\ResetPasswordController::create
* @see app/Http/Controllers/Web/Auth/ResetPasswordController.php:20
* @route '/reset-password'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web\Auth\ResetPasswordController::create
* @see app/Http/Controllers/Web/Auth/ResetPasswordController.php:20
* @route '/reset-password'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Web\Auth\ResetPasswordController::store
* @see app/Http/Controllers/Web/Auth/ResetPasswordController.php:28
* @route '/reset-password'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/reset-password',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Web\Auth\ResetPasswordController::store
* @see app/Http/Controllers/Web/Auth/ResetPasswordController.php:28
* @route '/reset-password'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\Auth\ResetPasswordController::store
* @see app/Http/Controllers/Web/Auth/ResetPasswordController.php:28
* @route '/reset-password'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

const ResetPasswordController = { create, store }

export default ResetPasswordController