import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\FileController::index
* @see app/Http/Controllers/Api/FileController.php:21
* @route '/api/v1/user-medications/{fileableId}/files'
*/
const indexc929f0f4c20d12b7271f7e9f9d4cf0a3 = (args: { fileableId: string | number } | [fileableId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexc929f0f4c20d12b7271f7e9f9d4cf0a3.url(args, options),
    method: 'get',
})

indexc929f0f4c20d12b7271f7e9f9d4cf0a3.definition = {
    methods: ["get","head"],
    url: '/api/v1/user-medications/{fileableId}/files',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\FileController::index
* @see app/Http/Controllers/Api/FileController.php:21
* @route '/api/v1/user-medications/{fileableId}/files'
*/
indexc929f0f4c20d12b7271f7e9f9d4cf0a3.url = (args: { fileableId: string | number } | [fileableId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return indexc929f0f4c20d12b7271f7e9f9d4cf0a3.definition.url
            .replace('{fileableId}', parsedArgs.fileableId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\FileController::index
* @see app/Http/Controllers/Api/FileController.php:21
* @route '/api/v1/user-medications/{fileableId}/files'
*/
indexc929f0f4c20d12b7271f7e9f9d4cf0a3.get = (args: { fileableId: string | number } | [fileableId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexc929f0f4c20d12b7271f7e9f9d4cf0a3.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\FileController::index
* @see app/Http/Controllers/Api/FileController.php:21
* @route '/api/v1/user-medications/{fileableId}/files'
*/
indexc929f0f4c20d12b7271f7e9f9d4cf0a3.head = (args: { fileableId: string | number } | [fileableId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexc929f0f4c20d12b7271f7e9f9d4cf0a3.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\FileController::index
* @see app/Http/Controllers/Api/FileController.php:21
* @route '/api/v1/users/{fileableId}/files'
*/
const index56e17147fda96852600d2ad1a13a86a1 = (args: { fileableId: string | number } | [fileableId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index56e17147fda96852600d2ad1a13a86a1.url(args, options),
    method: 'get',
})

index56e17147fda96852600d2ad1a13a86a1.definition = {
    methods: ["get","head"],
    url: '/api/v1/users/{fileableId}/files',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\FileController::index
* @see app/Http/Controllers/Api/FileController.php:21
* @route '/api/v1/users/{fileableId}/files'
*/
index56e17147fda96852600d2ad1a13a86a1.url = (args: { fileableId: string | number } | [fileableId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return index56e17147fda96852600d2ad1a13a86a1.definition.url
            .replace('{fileableId}', parsedArgs.fileableId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\FileController::index
* @see app/Http/Controllers/Api/FileController.php:21
* @route '/api/v1/users/{fileableId}/files'
*/
index56e17147fda96852600d2ad1a13a86a1.get = (args: { fileableId: string | number } | [fileableId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index56e17147fda96852600d2ad1a13a86a1.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\FileController::index
* @see app/Http/Controllers/Api/FileController.php:21
* @route '/api/v1/users/{fileableId}/files'
*/
index56e17147fda96852600d2ad1a13a86a1.head = (args: { fileableId: string | number } | [fileableId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index56e17147fda96852600d2ad1a13a86a1.url(args, options),
    method: 'head',
})

export const index = {
    '/api/v1/user-medications/{fileableId}/files': indexc929f0f4c20d12b7271f7e9f9d4cf0a3,
    '/api/v1/users/{fileableId}/files': index56e17147fda96852600d2ad1a13a86a1,
}

/**
* @see \App\Http\Controllers\Api\FileController::store
* @see app/Http/Controllers/Api/FileController.php:28
* @route '/api/v1/user-medications/{fileableId}/files'
*/
const storec929f0f4c20d12b7271f7e9f9d4cf0a3 = (args: { fileableId: string | number } | [fileableId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storec929f0f4c20d12b7271f7e9f9d4cf0a3.url(args, options),
    method: 'post',
})

storec929f0f4c20d12b7271f7e9f9d4cf0a3.definition = {
    methods: ["post"],
    url: '/api/v1/user-medications/{fileableId}/files',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\FileController::store
* @see app/Http/Controllers/Api/FileController.php:28
* @route '/api/v1/user-medications/{fileableId}/files'
*/
storec929f0f4c20d12b7271f7e9f9d4cf0a3.url = (args: { fileableId: string | number } | [fileableId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return storec929f0f4c20d12b7271f7e9f9d4cf0a3.definition.url
            .replace('{fileableId}', parsedArgs.fileableId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\FileController::store
* @see app/Http/Controllers/Api/FileController.php:28
* @route '/api/v1/user-medications/{fileableId}/files'
*/
storec929f0f4c20d12b7271f7e9f9d4cf0a3.post = (args: { fileableId: string | number } | [fileableId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storec929f0f4c20d12b7271f7e9f9d4cf0a3.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\FileController::store
* @see app/Http/Controllers/Api/FileController.php:28
* @route '/api/v1/users/{fileableId}/files'
*/
const store56e17147fda96852600d2ad1a13a86a1 = (args: { fileableId: string | number } | [fileableId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store56e17147fda96852600d2ad1a13a86a1.url(args, options),
    method: 'post',
})

store56e17147fda96852600d2ad1a13a86a1.definition = {
    methods: ["post"],
    url: '/api/v1/users/{fileableId}/files',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\FileController::store
* @see app/Http/Controllers/Api/FileController.php:28
* @route '/api/v1/users/{fileableId}/files'
*/
store56e17147fda96852600d2ad1a13a86a1.url = (args: { fileableId: string | number } | [fileableId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return store56e17147fda96852600d2ad1a13a86a1.definition.url
            .replace('{fileableId}', parsedArgs.fileableId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\FileController::store
* @see app/Http/Controllers/Api/FileController.php:28
* @route '/api/v1/users/{fileableId}/files'
*/
store56e17147fda96852600d2ad1a13a86a1.post = (args: { fileableId: string | number } | [fileableId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store56e17147fda96852600d2ad1a13a86a1.url(args, options),
    method: 'post',
})

export const store = {
    '/api/v1/user-medications/{fileableId}/files': storec929f0f4c20d12b7271f7e9f9d4cf0a3,
    '/api/v1/users/{fileableId}/files': store56e17147fda96852600d2ad1a13a86a1,
}

/**
* @see \App\Http\Controllers\Api\FileController::show
* @see app/Http/Controllers/Api/FileController.php:40
* @route '/api/v1/user-medications/{fileableId}/files/{file}'
*/
const showa8a4fe7d44a0259f11fae7f458ed0db0 = (args: { fileableId: string | number, file: number | { id: number } } | [fileableId: string | number, file: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showa8a4fe7d44a0259f11fae7f458ed0db0.url(args, options),
    method: 'get',
})

showa8a4fe7d44a0259f11fae7f458ed0db0.definition = {
    methods: ["get","head"],
    url: '/api/v1/user-medications/{fileableId}/files/{file}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\FileController::show
* @see app/Http/Controllers/Api/FileController.php:40
* @route '/api/v1/user-medications/{fileableId}/files/{file}'
*/
showa8a4fe7d44a0259f11fae7f458ed0db0.url = (args: { fileableId: string | number, file: number | { id: number } } | [fileableId: string | number, file: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return showa8a4fe7d44a0259f11fae7f458ed0db0.definition.url
            .replace('{fileableId}', parsedArgs.fileableId.toString())
            .replace('{file}', parsedArgs.file.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\FileController::show
* @see app/Http/Controllers/Api/FileController.php:40
* @route '/api/v1/user-medications/{fileableId}/files/{file}'
*/
showa8a4fe7d44a0259f11fae7f458ed0db0.get = (args: { fileableId: string | number, file: number | { id: number } } | [fileableId: string | number, file: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showa8a4fe7d44a0259f11fae7f458ed0db0.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\FileController::show
* @see app/Http/Controllers/Api/FileController.php:40
* @route '/api/v1/user-medications/{fileableId}/files/{file}'
*/
showa8a4fe7d44a0259f11fae7f458ed0db0.head = (args: { fileableId: string | number, file: number | { id: number } } | [fileableId: string | number, file: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showa8a4fe7d44a0259f11fae7f458ed0db0.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\FileController::show
* @see app/Http/Controllers/Api/FileController.php:40
* @route '/api/v1/users/{fileableId}/files/{file}'
*/
const show01271085b232704b7f7594f4149221d0 = (args: { fileableId: string | number, file: number | { id: number } } | [fileableId: string | number, file: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show01271085b232704b7f7594f4149221d0.url(args, options),
    method: 'get',
})

show01271085b232704b7f7594f4149221d0.definition = {
    methods: ["get","head"],
    url: '/api/v1/users/{fileableId}/files/{file}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\FileController::show
* @see app/Http/Controllers/Api/FileController.php:40
* @route '/api/v1/users/{fileableId}/files/{file}'
*/
show01271085b232704b7f7594f4149221d0.url = (args: { fileableId: string | number, file: number | { id: number } } | [fileableId: string | number, file: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return show01271085b232704b7f7594f4149221d0.definition.url
            .replace('{fileableId}', parsedArgs.fileableId.toString())
            .replace('{file}', parsedArgs.file.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\FileController::show
* @see app/Http/Controllers/Api/FileController.php:40
* @route '/api/v1/users/{fileableId}/files/{file}'
*/
show01271085b232704b7f7594f4149221d0.get = (args: { fileableId: string | number, file: number | { id: number } } | [fileableId: string | number, file: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show01271085b232704b7f7594f4149221d0.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\FileController::show
* @see app/Http/Controllers/Api/FileController.php:40
* @route '/api/v1/users/{fileableId}/files/{file}'
*/
show01271085b232704b7f7594f4149221d0.head = (args: { fileableId: string | number, file: number | { id: number } } | [fileableId: string | number, file: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show01271085b232704b7f7594f4149221d0.url(args, options),
    method: 'head',
})

export const show = {
    '/api/v1/user-medications/{fileableId}/files/{file}': showa8a4fe7d44a0259f11fae7f458ed0db0,
    '/api/v1/users/{fileableId}/files/{file}': show01271085b232704b7f7594f4149221d0,
}

/**
* @see \App\Http\Controllers\Api\FileController::update
* @see app/Http/Controllers/Api/FileController.php:45
* @route '/api/v1/user-medications/{fileableId}/files/{file}'
*/
const updatea8a4fe7d44a0259f11fae7f458ed0db0 = (args: { fileableId: string | number, file: number | { id: number } } | [fileableId: string | number, file: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatea8a4fe7d44a0259f11fae7f458ed0db0.url(args, options),
    method: 'put',
})

updatea8a4fe7d44a0259f11fae7f458ed0db0.definition = {
    methods: ["put"],
    url: '/api/v1/user-medications/{fileableId}/files/{file}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\FileController::update
* @see app/Http/Controllers/Api/FileController.php:45
* @route '/api/v1/user-medications/{fileableId}/files/{file}'
*/
updatea8a4fe7d44a0259f11fae7f458ed0db0.url = (args: { fileableId: string | number, file: number | { id: number } } | [fileableId: string | number, file: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return updatea8a4fe7d44a0259f11fae7f458ed0db0.definition.url
            .replace('{fileableId}', parsedArgs.fileableId.toString())
            .replace('{file}', parsedArgs.file.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\FileController::update
* @see app/Http/Controllers/Api/FileController.php:45
* @route '/api/v1/user-medications/{fileableId}/files/{file}'
*/
updatea8a4fe7d44a0259f11fae7f458ed0db0.put = (args: { fileableId: string | number, file: number | { id: number } } | [fileableId: string | number, file: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatea8a4fe7d44a0259f11fae7f458ed0db0.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\FileController::update
* @see app/Http/Controllers/Api/FileController.php:45
* @route '/api/v1/users/{fileableId}/files/{file}'
*/
const update01271085b232704b7f7594f4149221d0 = (args: { fileableId: string | number, file: number | { id: number } } | [fileableId: string | number, file: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update01271085b232704b7f7594f4149221d0.url(args, options),
    method: 'put',
})

update01271085b232704b7f7594f4149221d0.definition = {
    methods: ["put"],
    url: '/api/v1/users/{fileableId}/files/{file}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\FileController::update
* @see app/Http/Controllers/Api/FileController.php:45
* @route '/api/v1/users/{fileableId}/files/{file}'
*/
update01271085b232704b7f7594f4149221d0.url = (args: { fileableId: string | number, file: number | { id: number } } | [fileableId: string | number, file: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return update01271085b232704b7f7594f4149221d0.definition.url
            .replace('{fileableId}', parsedArgs.fileableId.toString())
            .replace('{file}', parsedArgs.file.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\FileController::update
* @see app/Http/Controllers/Api/FileController.php:45
* @route '/api/v1/users/{fileableId}/files/{file}'
*/
update01271085b232704b7f7594f4149221d0.put = (args: { fileableId: string | number, file: number | { id: number } } | [fileableId: string | number, file: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update01271085b232704b7f7594f4149221d0.url(args, options),
    method: 'put',
})

export const update = {
    '/api/v1/user-medications/{fileableId}/files/{file}': updatea8a4fe7d44a0259f11fae7f458ed0db0,
    '/api/v1/users/{fileableId}/files/{file}': update01271085b232704b7f7594f4149221d0,
}

/**
* @see \App\Http\Controllers\Api\FileController::destroy
* @see app/Http/Controllers/Api/FileController.php:57
* @route '/api/v1/user-medications/{fileableId}/files/{file}'
*/
const destroya8a4fe7d44a0259f11fae7f458ed0db0 = (args: { fileableId: string | number, file: number | { id: number } } | [fileableId: string | number, file: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroya8a4fe7d44a0259f11fae7f458ed0db0.url(args, options),
    method: 'delete',
})

destroya8a4fe7d44a0259f11fae7f458ed0db0.definition = {
    methods: ["delete"],
    url: '/api/v1/user-medications/{fileableId}/files/{file}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\FileController::destroy
* @see app/Http/Controllers/Api/FileController.php:57
* @route '/api/v1/user-medications/{fileableId}/files/{file}'
*/
destroya8a4fe7d44a0259f11fae7f458ed0db0.url = (args: { fileableId: string | number, file: number | { id: number } } | [fileableId: string | number, file: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return destroya8a4fe7d44a0259f11fae7f458ed0db0.definition.url
            .replace('{fileableId}', parsedArgs.fileableId.toString())
            .replace('{file}', parsedArgs.file.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\FileController::destroy
* @see app/Http/Controllers/Api/FileController.php:57
* @route '/api/v1/user-medications/{fileableId}/files/{file}'
*/
destroya8a4fe7d44a0259f11fae7f458ed0db0.delete = (args: { fileableId: string | number, file: number | { id: number } } | [fileableId: string | number, file: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroya8a4fe7d44a0259f11fae7f458ed0db0.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\FileController::destroy
* @see app/Http/Controllers/Api/FileController.php:57
* @route '/api/v1/users/{fileableId}/files/{file}'
*/
const destroy01271085b232704b7f7594f4149221d0 = (args: { fileableId: string | number, file: number | { id: number } } | [fileableId: string | number, file: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy01271085b232704b7f7594f4149221d0.url(args, options),
    method: 'delete',
})

destroy01271085b232704b7f7594f4149221d0.definition = {
    methods: ["delete"],
    url: '/api/v1/users/{fileableId}/files/{file}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\FileController::destroy
* @see app/Http/Controllers/Api/FileController.php:57
* @route '/api/v1/users/{fileableId}/files/{file}'
*/
destroy01271085b232704b7f7594f4149221d0.url = (args: { fileableId: string | number, file: number | { id: number } } | [fileableId: string | number, file: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return destroy01271085b232704b7f7594f4149221d0.definition.url
            .replace('{fileableId}', parsedArgs.fileableId.toString())
            .replace('{file}', parsedArgs.file.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\FileController::destroy
* @see app/Http/Controllers/Api/FileController.php:57
* @route '/api/v1/users/{fileableId}/files/{file}'
*/
destroy01271085b232704b7f7594f4149221d0.delete = (args: { fileableId: string | number, file: number | { id: number } } | [fileableId: string | number, file: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy01271085b232704b7f7594f4149221d0.url(args, options),
    method: 'delete',
})

export const destroy = {
    '/api/v1/user-medications/{fileableId}/files/{file}': destroya8a4fe7d44a0259f11fae7f458ed0db0,
    '/api/v1/users/{fileableId}/files/{file}': destroy01271085b232704b7f7594f4149221d0,
}

const FileController = { index, store, show, update, destroy }

export default FileController