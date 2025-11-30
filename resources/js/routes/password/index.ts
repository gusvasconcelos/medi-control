import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Web\Auth\ForgotPasswordController::request
* @see app/Http/Controllers/Web/Auth/ForgotPasswordController.php:19
* @route '/forgot-password'
*/
export const request = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: request.url(options),
    method: 'get',
})

request.definition = {
    methods: ["get","head"],
    url: '/forgot-password',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\Auth\ForgotPasswordController::request
* @see app/Http/Controllers/Web/Auth/ForgotPasswordController.php:19
* @route '/forgot-password'
*/
request.url = (options?: RouteQueryOptions) => {
    return request.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\Auth\ForgotPasswordController::request
* @see app/Http/Controllers/Web/Auth/ForgotPasswordController.php:19
* @route '/forgot-password'
*/
request.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: request.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web\Auth\ForgotPasswordController::request
* @see app/Http/Controllers/Web/Auth/ForgotPasswordController.php:19
* @route '/forgot-password'
*/
request.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: request.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Web\Auth\ForgotPasswordController::email
* @see app/Http/Controllers/Web/Auth/ForgotPasswordController.php:24
* @route '/forgot-password'
*/
export const email = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: email.url(options),
    method: 'post',
})

email.definition = {
    methods: ["post"],
    url: '/forgot-password',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Web\Auth\ForgotPasswordController::email
* @see app/Http/Controllers/Web/Auth/ForgotPasswordController.php:24
* @route '/forgot-password'
*/
email.url = (options?: RouteQueryOptions) => {
    return email.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\Auth\ForgotPasswordController::email
* @see app/Http/Controllers/Web/Auth/ForgotPasswordController.php:24
* @route '/forgot-password'
*/
email.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: email.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Web\Auth\ResetPasswordController::reset
* @see app/Http/Controllers/Web/Auth/ResetPasswordController.php:20
* @route '/reset-password'
*/
export const reset = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reset.url(options),
    method: 'get',
})

reset.definition = {
    methods: ["get","head"],
    url: '/reset-password',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\Auth\ResetPasswordController::reset
* @see app/Http/Controllers/Web/Auth/ResetPasswordController.php:20
* @route '/reset-password'
*/
reset.url = (options?: RouteQueryOptions) => {
    return reset.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\Auth\ResetPasswordController::reset
* @see app/Http/Controllers/Web/Auth/ResetPasswordController.php:20
* @route '/reset-password'
*/
reset.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reset.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web\Auth\ResetPasswordController::reset
* @see app/Http/Controllers/Web/Auth/ResetPasswordController.php:20
* @route '/reset-password'
*/
reset.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reset.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Web\Auth\ResetPasswordController::update
* @see app/Http/Controllers/Web/Auth/ResetPasswordController.php:28
* @route '/reset-password'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/reset-password',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Web\Auth\ResetPasswordController::update
* @see app/Http/Controllers/Web/Auth/ResetPasswordController.php:28
* @route '/reset-password'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\Auth\ResetPasswordController::update
* @see app/Http/Controllers/Web/Auth/ResetPasswordController.php:28
* @route '/reset-password'
*/
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

const password = {
    request: Object.assign(request, request),
    email: Object.assign(email, email),
    reset: Object.assign(reset, reset),
    update: Object.assign(update, update),
}

export default password