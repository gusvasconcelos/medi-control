import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Web\Medication\MedicationInteractionController::check
* @see app/Http/Controllers/Web/Medication/MedicationInteractionController.php:15
* @route '/medications/{medication}/check-interactions'
*/
export const check = (args: { medication: number | { id: number } } | [medication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: check.url(args, options),
    method: 'post',
})

check.definition = {
    methods: ["post"],
    url: '/medications/{medication}/check-interactions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Web\Medication\MedicationInteractionController::check
* @see app/Http/Controllers/Web/Medication/MedicationInteractionController.php:15
* @route '/medications/{medication}/check-interactions'
*/
check.url = (args: { medication: number | { id: number } } | [medication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { medication: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { medication: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            medication: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        medication: typeof args.medication === 'object'
        ? args.medication.id
        : args.medication,
    }

    return check.definition.url
            .replace('{medication}', parsedArgs.medication.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\Medication\MedicationInteractionController::check
* @see app/Http/Controllers/Web/Medication/MedicationInteractionController.php:15
* @route '/medications/{medication}/check-interactions'
*/
check.post = (args: { medication: number | { id: number } } | [medication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: check.url(args, options),
    method: 'post',
})

const MedicationInteractionController = { check }

export default MedicationInteractionController