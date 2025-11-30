import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../wayfinder'
/**
* @see vendor/laravel/pulse/src/PulseServiceProvider.php:106
* @route '/pulse'
*/
export const pulse = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pulse.url(options),
    method: 'get',
})

pulse.definition = {
    methods: ["get","head"],
    url: '/pulse',
} satisfies RouteDefinition<["get","head"]>

/**
* @see vendor/laravel/pulse/src/PulseServiceProvider.php:106
* @route '/pulse'
*/
pulse.url = (options?: RouteQueryOptions) => {
    return pulse.definition.url + queryParams(options)
}

/**
* @see vendor/laravel/pulse/src/PulseServiceProvider.php:106
* @route '/pulse'
*/
pulse.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pulse.url(options),
    method: 'get',
})

/**
* @see vendor/laravel/pulse/src/PulseServiceProvider.php:106
* @route '/pulse'
*/
pulse.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pulse.url(options),
    method: 'head',
})

/**
* @see routes/web.php:19
* @route '/'
*/
export const welcome = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: welcome.url(options),
    method: 'get',
})

welcome.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:19
* @route '/'
*/
welcome.url = (options?: RouteQueryOptions) => {
    return welcome.definition.url + queryParams(options)
}

/**
* @see routes/web.php:19
* @route '/'
*/
welcome.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: welcome.url(options),
    method: 'get',
})

/**
* @see routes/web.php:19
* @route '/'
*/
welcome.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: welcome.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Web\Auth\LoginController::login
* @see app/Http/Controllers/Web/Auth/LoginController.php:15
* @route '/login'
*/
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ["get","head"],
    url: '/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\Auth\LoginController::login
* @see app/Http/Controllers/Web/Auth/LoginController.php:15
* @route '/login'
*/
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\Auth\LoginController::login
* @see app/Http/Controllers/Web/Auth/LoginController.php:15
* @route '/login'
*/
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web\Auth\LoginController::login
* @see app/Http/Controllers/Web/Auth/LoginController.php:15
* @route '/login'
*/
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Web\Auth\RegisterController::register
* @see app/Http/Controllers/Web/Auth/RegisterController.php:14
* @route '/register'
*/
export const register = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

register.definition = {
    methods: ["get","head"],
    url: '/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\Auth\RegisterController::register
* @see app/Http/Controllers/Web/Auth/RegisterController.php:14
* @route '/register'
*/
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\Auth\RegisterController::register
* @see app/Http/Controllers/Web/Auth/RegisterController.php:14
* @route '/register'
*/
register.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web\Auth\RegisterController::register
* @see app/Http/Controllers/Web/Auth/RegisterController.php:14
* @route '/register'
*/
register.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: register.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Web\Auth\LoginController::logout
* @see app/Http/Controllers/Web/Auth/LoginController.php:31
* @route '/logout'
*/
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ["post"],
    url: '/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Web\Auth\LoginController::logout
* @see app/Http/Controllers/Web/Auth/LoginController.php:31
* @route '/logout'
*/
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\Auth\LoginController::logout
* @see app/Http/Controllers/Web/Auth/LoginController.php:31
* @route '/logout'
*/
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

/**
* @see routes/web.php:39
* @route '/select-role'
*/
export const selectRole = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: selectRole.url(options),
    method: 'get',
})

selectRole.definition = {
    methods: ["get","head"],
    url: '/select-role',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:39
* @route '/select-role'
*/
selectRole.url = (options?: RouteQueryOptions) => {
    return selectRole.definition.url + queryParams(options)
}

/**
* @see routes/web.php:39
* @route '/select-role'
*/
selectRole.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: selectRole.url(options),
    method: 'get',
})

/**
* @see routes/web.php:39
* @route '/select-role'
*/
selectRole.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: selectRole.url(options),
    method: 'head',
})

/**
* @see routes/web.php:40
* @route '/dashboard'
*/
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:40
* @route '/dashboard'
*/
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see routes/web.php:40
* @route '/dashboard'
*/
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

/**
* @see routes/web.php:40
* @route '/dashboard'
*/
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

