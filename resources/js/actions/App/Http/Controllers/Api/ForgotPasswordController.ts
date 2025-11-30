import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\ForgotPasswordController::sendResetLink
* @see app/Http/Controllers/Api/ForgotPasswordController.php:17
* @route '/api/v1/auth/forgot-password'
*/
export const sendResetLink = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendResetLink.url(options),
    method: 'post',
})

sendResetLink.definition = {
    methods: ["post"],
    url: '/api/v1/auth/forgot-password',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ForgotPasswordController::sendResetLink
* @see app/Http/Controllers/Api/ForgotPasswordController.php:17
* @route '/api/v1/auth/forgot-password'
*/
sendResetLink.url = (options?: RouteQueryOptions) => {
    return sendResetLink.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ForgotPasswordController::sendResetLink
* @see app/Http/Controllers/Api/ForgotPasswordController.php:17
* @route '/api/v1/auth/forgot-password'
*/
sendResetLink.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendResetLink.url(options),
    method: 'post',
})

const ForgotPasswordController = { sendResetLink }

export default ForgotPasswordController