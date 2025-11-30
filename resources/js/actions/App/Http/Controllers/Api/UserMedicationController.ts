import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\UserMedicationController::indicators
* @see app/Http/Controllers/Api/UserMedicationController.php:32
* @route '/api/v1/user-medications/indicators'
*/
export const indicators = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indicators.url(options),
    method: 'get',
})

indicators.definition = {
    methods: ["get","head"],
    url: '/api/v1/user-medications/indicators',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\UserMedicationController::indicators
* @see app/Http/Controllers/Api/UserMedicationController.php:32
* @route '/api/v1/user-medications/indicators'
*/
indicators.url = (options?: RouteQueryOptions) => {
    return indicators.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserMedicationController::indicators
* @see app/Http/Controllers/Api/UserMedicationController.php:32
* @route '/api/v1/user-medications/indicators'
*/
indicators.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indicators.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\UserMedicationController::indicators
* @see app/Http/Controllers/Api/UserMedicationController.php:32
* @route '/api/v1/user-medications/indicators'
*/
indicators.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indicators.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\UserMedicationController::adherenceReport
* @see app/Http/Controllers/Api/UserMedicationController.php:81
* @route '/api/v1/user-medications/adherence-reports'
*/
export const adherenceReport = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: adherenceReport.url(options),
    method: 'get',
})

adherenceReport.definition = {
    methods: ["get","head"],
    url: '/api/v1/user-medications/adherence-reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\UserMedicationController::adherenceReport
* @see app/Http/Controllers/Api/UserMedicationController.php:81
* @route '/api/v1/user-medications/adherence-reports'
*/
adherenceReport.url = (options?: RouteQueryOptions) => {
    return adherenceReport.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserMedicationController::adherenceReport
* @see app/Http/Controllers/Api/UserMedicationController.php:81
* @route '/api/v1/user-medications/adherence-reports'
*/
adherenceReport.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: adherenceReport.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\UserMedicationController::adherenceReport
* @see app/Http/Controllers/Api/UserMedicationController.php:81
* @route '/api/v1/user-medications/adherence-reports'
*/
adherenceReport.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: adherenceReport.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\UserMedicationController::adherenceReportPdf
* @see app/Http/Controllers/Api/UserMedicationController.php:90
* @route '/api/v1/user-medications/adherence-reports'
*/
export const adherenceReportPdf = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: adherenceReportPdf.url(options),
    method: 'post',
})

adherenceReportPdf.definition = {
    methods: ["post"],
    url: '/api/v1/user-medications/adherence-reports',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\UserMedicationController::adherenceReportPdf
* @see app/Http/Controllers/Api/UserMedicationController.php:90
* @route '/api/v1/user-medications/adherence-reports'
*/
adherenceReportPdf.url = (options?: RouteQueryOptions) => {
    return adherenceReportPdf.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserMedicationController::adherenceReportPdf
* @see app/Http/Controllers/Api/UserMedicationController.php:90
* @route '/api/v1/user-medications/adherence-reports'
*/
adherenceReportPdf.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: adherenceReportPdf.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\UserMedicationController::getUserMedications
* @see app/Http/Controllers/Api/UserMedicationController.php:23
* @route '/api/v1/user-medications'
*/
export const getUserMedications = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getUserMedications.url(options),
    method: 'get',
})

getUserMedications.definition = {
    methods: ["get","head"],
    url: '/api/v1/user-medications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\UserMedicationController::getUserMedications
* @see app/Http/Controllers/Api/UserMedicationController.php:23
* @route '/api/v1/user-medications'
*/
getUserMedications.url = (options?: RouteQueryOptions) => {
    return getUserMedications.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserMedicationController::getUserMedications
* @see app/Http/Controllers/Api/UserMedicationController.php:23
* @route '/api/v1/user-medications'
*/
getUserMedications.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getUserMedications.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\UserMedicationController::getUserMedications
* @see app/Http/Controllers/Api/UserMedicationController.php:23
* @route '/api/v1/user-medications'
*/
getUserMedications.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getUserMedications.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\UserMedicationController::store
* @see app/Http/Controllers/Api/UserMedicationController.php:41
* @route '/api/v1/user-medications'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/user-medications',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\UserMedicationController::store
* @see app/Http/Controllers/Api/UserMedicationController.php:41
* @route '/api/v1/user-medications'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserMedicationController::store
* @see app/Http/Controllers/Api/UserMedicationController.php:41
* @route '/api/v1/user-medications'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\UserMedicationController::show
* @see app/Http/Controllers/Api/UserMedicationController.php:53
* @route '/api/v1/user-medications/{id}'
*/
export const show = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/user-medications/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\UserMedicationController::show
* @see app/Http/Controllers/Api/UserMedicationController.php:53
* @route '/api/v1/user-medications/{id}'
*/
show.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return show.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserMedicationController::show
* @see app/Http/Controllers/Api/UserMedicationController.php:53
* @route '/api/v1/user-medications/{id}'
*/
show.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\UserMedicationController::show
* @see app/Http/Controllers/Api/UserMedicationController.php:53
* @route '/api/v1/user-medications/{id}'
*/
show.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\UserMedicationController::update
* @see app/Http/Controllers/Api/UserMedicationController.php:60
* @route '/api/v1/user-medications/{id}'
*/
export const update = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/v1/user-medications/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\UserMedicationController::update
* @see app/Http/Controllers/Api/UserMedicationController.php:60
* @route '/api/v1/user-medications/{id}'
*/
update.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return update.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserMedicationController::update
* @see app/Http/Controllers/Api/UserMedicationController.php:60
* @route '/api/v1/user-medications/{id}'
*/
update.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\UserMedicationController::destroy
* @see app/Http/Controllers/Api/UserMedicationController.php:72
* @route '/api/v1/user-medications/{id}'
*/
export const destroy = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/user-medications/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\UserMedicationController::destroy
* @see app/Http/Controllers/Api/UserMedicationController.php:72
* @route '/api/v1/user-medications/{id}'
*/
destroy.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return destroy.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserMedicationController::destroy
* @see app/Http/Controllers/Api/UserMedicationController.php:72
* @route '/api/v1/user-medications/{id}'
*/
destroy.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const UserMedicationController = { indicators, adherenceReport, adherenceReportPdf, getUserMedications, store, show, update, destroy }

export default UserMedicationController