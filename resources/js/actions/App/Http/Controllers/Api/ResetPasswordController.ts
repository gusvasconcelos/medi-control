import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\ResetPasswordController::resetPassword
* @see app/Http/Controllers/Api/ResetPasswordController.php:17
* @route '/api/v1/auth/reset-password'
*/
export const resetPassword = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resetPassword.url(options),
    method: 'post',
})

resetPassword.definition = {
    methods: ["post"],
    url: '/api/v1/auth/reset-password',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ResetPasswordController::resetPassword
* @see app/Http/Controllers/Api/ResetPasswordController.php:17
* @route '/api/v1/auth/reset-password'
*/
resetPassword.url = (options?: RouteQueryOptions) => {
    return resetPassword.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ResetPasswordController::resetPassword
* @see app/Http/Controllers/Api/ResetPasswordController.php:17
* @route '/api/v1/auth/reset-password'
*/
resetPassword.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resetPassword.url(options),
    method: 'post',
})

const ResetPasswordController = { resetPassword }

export default ResetPasswordController