import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\MedicationLogController::logTaken
* @see app/Http/Controllers/Api/MedicationLogController.php:18
* @route '/api/v1/user-medications/{id}/log-taken'
*/
export const logTaken = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logTaken.url(args, options),
    method: 'post',
})

logTaken.definition = {
    methods: ["post"],
    url: '/api/v1/user-medications/{id}/log-taken',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\MedicationLogController::logTaken
* @see app/Http/Controllers/Api/MedicationLogController.php:18
* @route '/api/v1/user-medications/{id}/log-taken'
*/
logTaken.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return logTaken.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\MedicationLogController::logTaken
* @see app/Http/Controllers/Api/MedicationLogController.php:18
* @route '/api/v1/user-medications/{id}/log-taken'
*/
logTaken.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logTaken.url(args, options),
    method: 'post',
})

const MedicationLogController = { logTaken }

export default MedicationLogController