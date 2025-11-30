import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Web\Auth\RegisterController::create
* @see app/Http/Controllers/Web/Auth/RegisterController.php:14
* @route '/register'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\Auth\RegisterController::create
* @see app/Http/Controllers/Web/Auth/RegisterController.php:14
* @route '/register'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\Auth\RegisterController::create
* @see app/Http/Controllers/Web/Auth/RegisterController.php:14
* @route '/register'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web\Auth\RegisterController::create
* @see app/Http/Controllers/Web/Auth/RegisterController.php:14
* @route '/register'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Web\Auth\RegisterController::store
* @see app/Http/Controllers/Web/Auth/RegisterController.php:19
* @route '/register'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/register',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Web\Auth\RegisterController::store
* @see app/Http/Controllers/Web/Auth/RegisterController.php:19
* @route '/register'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\Auth\RegisterController::store
* @see app/Http/Controllers/Web/Auth/RegisterController.php:19
* @route '/register'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

const RegisterController = { create, store }

export default RegisterController