import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Web\Medication\MedicationController::search
* @see app/Http/Controllers/Web/Medication/MedicationController.php:27
* @route '/medications/search'
*/
export const search = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

search.definition = {
    methods: ["get","head"],
    url: '/medications/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\Medication\MedicationController::search
* @see app/Http/Controllers/Web/Medication/MedicationController.php:27
* @route '/medications/search'
*/
search.url = (options?: RouteQueryOptions) => {
    return search.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\Medication\MedicationController::search
* @see app/Http/Controllers/Web/Medication/MedicationController.php:27
* @route '/medications/search'
*/
search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web\Medication\MedicationController::search
* @see app/Http/Controllers/Web/Medication/MedicationController.php:27
* @route '/medications/search'
*/
search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Web\Medication\MedicationController::index
* @see app/Http/Controllers/Web/Medication/MedicationController.php:17
* @route '/medications'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/medications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\Medication\MedicationController::index
* @see app/Http/Controllers/Web/Medication/MedicationController.php:17
* @route '/medications'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\Medication\MedicationController::index
* @see app/Http/Controllers/Web/Medication/MedicationController.php:17
* @route '/medications'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web\Medication\MedicationController::index
* @see app/Http/Controllers/Web/Medication/MedicationController.php:17
* @route '/medications'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Web\Medication\MedicationController::create
* @see app/Http/Controllers/Web/Medication/MedicationController.php:36
* @route '/medications/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/medications/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\Medication\MedicationController::create
* @see app/Http/Controllers/Web/Medication/MedicationController.php:36
* @route '/medications/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\Medication\MedicationController::create
* @see app/Http/Controllers/Web/Medication/MedicationController.php:36
* @route '/medications/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web\Medication\MedicationController::create
* @see app/Http/Controllers/Web/Medication/MedicationController.php:36
* @route '/medications/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Web\Medication\MedicationController::store
* @see app/Http/Controllers/Web/Medication/MedicationController.php:41
* @route '/medications'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/medications',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Web\Medication\MedicationController::store
* @see app/Http/Controllers/Web/Medication/MedicationController.php:41
* @route '/medications'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\Medication\MedicationController::store
* @see app/Http/Controllers/Web/Medication/MedicationController.php:41
* @route '/medications'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Web\Medication\MedicationController::show
* @see app/Http/Controllers/Web/Medication/MedicationController.php:51
* @route '/medications/{medication}'
*/
export const show = (args: { medication: number | { id: number } } | [medication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/medications/{medication}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\Medication\MedicationController::show
* @see app/Http/Controllers/Web/Medication/MedicationController.php:51
* @route '/medications/{medication}'
*/
show.url = (args: { medication: number | { id: number } } | [medication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{medication}', parsedArgs.medication.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\Medication\MedicationController::show
* @see app/Http/Controllers/Web/Medication/MedicationController.php:51
* @route '/medications/{medication}'
*/
show.get = (args: { medication: number | { id: number } } | [medication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web\Medication\MedicationController::show
* @see app/Http/Controllers/Web/Medication/MedicationController.php:51
* @route '/medications/{medication}'
*/
show.head = (args: { medication: number | { id: number } } | [medication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Web\Medication\MedicationController::edit
* @see app/Http/Controllers/Web/Medication/MedicationController.php:58
* @route '/medications/{medication}/edit'
*/
export const edit = (args: { medication: number | { id: number } } | [medication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/medications/{medication}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\Medication\MedicationController::edit
* @see app/Http/Controllers/Web/Medication/MedicationController.php:58
* @route '/medications/{medication}/edit'
*/
edit.url = (args: { medication: number | { id: number } } | [medication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{medication}', parsedArgs.medication.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\Medication\MedicationController::edit
* @see app/Http/Controllers/Web/Medication/MedicationController.php:58
* @route '/medications/{medication}/edit'
*/
edit.get = (args: { medication: number | { id: number } } | [medication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web\Medication\MedicationController::edit
* @see app/Http/Controllers/Web/Medication/MedicationController.php:58
* @route '/medications/{medication}/edit'
*/
edit.head = (args: { medication: number | { id: number } } | [medication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Web\Medication\MedicationController::update
* @see app/Http/Controllers/Web/Medication/MedicationController.php:65
* @route '/medications/{medication}'
*/
export const update = (args: { medication: number | { id: number } } | [medication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/medications/{medication}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Web\Medication\MedicationController::update
* @see app/Http/Controllers/Web/Medication/MedicationController.php:65
* @route '/medications/{medication}'
*/
update.url = (args: { medication: number | { id: number } } | [medication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{medication}', parsedArgs.medication.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\Medication\MedicationController::update
* @see app/Http/Controllers/Web/Medication/MedicationController.php:65
* @route '/medications/{medication}'
*/
update.put = (args: { medication: number | { id: number } } | [medication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Web\Medication\MedicationController::update
* @see app/Http/Controllers/Web/Medication/MedicationController.php:65
* @route '/medications/{medication}'
*/
update.patch = (args: { medication: number | { id: number } } | [medication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Web\Medication\MedicationController::destroy
* @see app/Http/Controllers/Web/Medication/MedicationController.php:75
* @route '/medications/{medication}'
*/
export const destroy = (args: { medication: number | { id: number } } | [medication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/medications/{medication}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Web\Medication\MedicationController::destroy
* @see app/Http/Controllers/Web/Medication/MedicationController.php:75
* @route '/medications/{medication}'
*/
destroy.url = (args: { medication: number | { id: number } } | [medication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{medication}', parsedArgs.medication.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\Medication\MedicationController::destroy
* @see app/Http/Controllers/Web/Medication/MedicationController.php:75
* @route '/medications/{medication}'
*/
destroy.delete = (args: { medication: number | { id: number } } | [medication: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const MedicationController = { search, index, create, store, show, edit, update, destroy }

export default MedicationController