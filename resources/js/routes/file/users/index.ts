import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\FileController::index
* @see app/Http/Controllers/Api/FileController.php:21
* @route '/api/v1/users/{fileableId}/files'
*/
export const index = (args: { fileableId: string | number } | [fileableId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/users/{fileableId}/files',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\FileController::index
* @see app/Http/Controllers/Api/FileController.php:21
* @route '/api/v1/users/{fileableId}/files'
*/
index.url = (args: { fileableId: string | number } | [fileableId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { fileableId: args }
    }

    if (Array.isArray(args)) {
        args = {
            fileableId: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        fileableId: args.fileableId,
    }

    return index.definition.url
            .replace('{fileableId}', parsedArgs.fileableId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\FileController::index
* @see app/Http/Controllers/Api/FileController.php:21
* @route '/api/v1/users/{fileableId}/files'
*/
index.get = (args: { fileableId: string | number } | [fileableId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\FileController::index
* @see app/Http/Controllers/Api/FileController.php:21
* @route '/api/v1/users/{fileableId}/files'
*/
index.head = (args: { fileableId: string | number } | [fileableId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\FileController::store
* @see app/Http/Controllers/Api/FileController.php:28
* @route '/api/v1/users/{fileableId}/files'
*/
export const store = (args: { fileableId: string | number } | [fileableId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/users/{fileableId}/files',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\FileController::store
* @see app/Http/Controllers/Api/FileController.php:28
* @route '/api/v1/users/{fileableId}/files'
*/
store.url = (args: { fileableId: string | number } | [fileableId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { fileableId: args }
    }

    if (Array.isArray(args)) {
        args = {
            fileableId: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        fileableId: args.fileableId,
    }

    return store.definition.url
            .replace('{fileableId}', parsedArgs.fileableId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\FileController::store
* @see app/Http/Controllers/Api/FileController.php:28
* @route '/api/v1/users/{fileableId}/files'
*/
store.post = (args: { fileableId: string | number } | [fileableId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\FileController::show
* @see app/Http/Controllers/Api/FileController.php:40
* @route '/api/v1/users/{fileableId}/files/{file}'
*/
export const show = (args: { fileableId: string | number, file: number | { id: number } } | [fileableId: string | number, file: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/users/{fileableId}/files/{file}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\FileController::show
* @see app/Http/Controllers/Api/FileController.php:40
* @route '/api/v1/users/{fileableId}/files/{file}'
*/
show.url = (args: { fileableId: string | number, file: number | { id: number } } | [fileableId: string | number, file: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            fileableId: args[0],
            file: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        fileableId: args.fileableId,
        file: typeof args.file === 'object'
        ? args.file.id
        : args.file,
    }

    return show.definition.url
            .replace('{fileableId}', parsedArgs.fileableId.toString())
            .replace('{file}', parsedArgs.file.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\FileController::show
* @see app/Http/Controllers/Api/FileController.php:40
* @route '/api/v1/users/{fileableId}/files/{file}'
*/
show.get = (args: { fileableId: string | number, file: number | { id: number } } | [fileableId: string | number, file: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\FileController::show
* @see app/Http/Controllers/Api/FileController.php:40
* @route '/api/v1/users/{fileableId}/files/{file}'
*/
show.head = (args: { fileableId: string | number, file: number | { id: number } } | [fileableId: string | number, file: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\FileController::update
* @see app/Http/Controllers/Api/FileController.php:45
* @route '/api/v1/users/{fileableId}/files/{file}'
*/
export const update = (args: { fileableId: string | number, file: number | { id: number } } | [fileableId: string | number, file: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/v1/users/{fileableId}/files/{file}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\FileController::update
* @see app/Http/Controllers/Api/FileController.php:45
* @route '/api/v1/users/{fileableId}/files/{file}'
*/
update.url = (args: { fileableId: string | number, file: number | { id: number } } | [fileableId: string | number, file: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            fileableId: args[0],
            file: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        fileableId: args.fileableId,
        file: typeof args.file === 'object'
        ? args.file.id
        : args.file,
    }

    return update.definition.url
            .replace('{fileableId}', parsedArgs.fileableId.toString())
            .replace('{file}', parsedArgs.file.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\FileController::update
* @see app/Http/Controllers/Api/FileController.php:45
* @route '/api/v1/users/{fileableId}/files/{file}'
*/
update.put = (args: { fileableId: string | number, file: number | { id: number } } | [fileableId: string | number, file: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\FileController::destroy
* @see app/Http/Controllers/Api/FileController.php:57
* @route '/api/v1/users/{fileableId}/files/{file}'
*/
export const destroy = (args: { fileableId: string | number, file: number | { id: number } } | [fileableId: string | number, file: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/users/{fileableId}/files/{file}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\FileController::destroy
* @see app/Http/Controllers/Api/FileController.php:57
* @route '/api/v1/users/{fileableId}/files/{file}'
*/
destroy.url = (args: { fileableId: string | number, file: number | { id: number } } | [fileableId: string | number, file: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            fileableId: args[0],
            file: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        fileableId: args.fileableId,
        file: typeof args.file === 'object'
        ? args.file.id
        : args.file,
    }

    return destroy.definition.url
            .replace('{fileableId}', parsedArgs.fileableId.toString())
            .replace('{file}', parsedArgs.file.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\FileController::destroy
* @see app/Http/Controllers/Api/FileController.php:57
* @route '/api/v1/users/{fileableId}/files/{file}'
*/
destroy.delete = (args: { fileableId: string | number, file: number | { id: number } } | [fileableId: string | number, file: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const users = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default users