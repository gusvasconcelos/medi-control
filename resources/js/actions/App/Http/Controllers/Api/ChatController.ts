import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\ChatController::show
* @see app/Http/Controllers/Api/ChatController.php:18
* @route '/api/v1/chat/session'
*/
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/chat/session',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ChatController::show
* @see app/Http/Controllers/Api/ChatController.php:18
* @route '/api/v1/chat/session'
*/
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ChatController::show
* @see app/Http/Controllers/Api/ChatController.php:18
* @route '/api/v1/chat/session'
*/
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ChatController::show
* @see app/Http/Controllers/Api/ChatController.php:18
* @route '/api/v1/chat/session'
*/
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ChatController::index
* @see app/Http/Controllers/Api/ChatController.php:31
* @route '/api/v1/chat/messages'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/chat/messages',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ChatController::index
* @see app/Http/Controllers/Api/ChatController.php:31
* @route '/api/v1/chat/messages'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ChatController::index
* @see app/Http/Controllers/Api/ChatController.php:31
* @route '/api/v1/chat/messages'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ChatController::index
* @see app/Http/Controllers/Api/ChatController.php:31
* @route '/api/v1/chat/messages'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ChatController::store
* @see app/Http/Controllers/Api/ChatController.php:44
* @route '/api/v1/chat/messages'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/chat/messages',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ChatController::store
* @see app/Http/Controllers/Api/ChatController.php:44
* @route '/api/v1/chat/messages'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ChatController::store
* @see app/Http/Controllers/Api/ChatController.php:44
* @route '/api/v1/chat/messages'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ChatController::streamMessage
* @see app/Http/Controllers/Api/ChatController.php:62
* @route '/api/v1/chat/messages/stream'
*/
export const streamMessage = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: streamMessage.url(options),
    method: 'post',
})

streamMessage.definition = {
    methods: ["post"],
    url: '/api/v1/chat/messages/stream',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ChatController::streamMessage
* @see app/Http/Controllers/Api/ChatController.php:62
* @route '/api/v1/chat/messages/stream'
*/
streamMessage.url = (options?: RouteQueryOptions) => {
    return streamMessage.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ChatController::streamMessage
* @see app/Http/Controllers/Api/ChatController.php:62
* @route '/api/v1/chat/messages/stream'
*/
streamMessage.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: streamMessage.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ChatController::destroy
* @see app/Http/Controllers/Api/ChatController.php:120
* @route '/api/v1/chat/history'
*/
export const destroy = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/chat/history',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\ChatController::destroy
* @see app/Http/Controllers/Api/ChatController.php:120
* @route '/api/v1/chat/history'
*/
destroy.url = (options?: RouteQueryOptions) => {
    return destroy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ChatController::destroy
* @see app/Http/Controllers/Api/ChatController.php:120
* @route '/api/v1/chat/history'
*/
destroy.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\ChatController::suggestedPrompts
* @see app/Http/Controllers/Api/ChatController.php:133
* @route '/api/v1/chat/suggested-prompts'
*/
export const suggestedPrompts = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: suggestedPrompts.url(options),
    method: 'get',
})

suggestedPrompts.definition = {
    methods: ["get","head"],
    url: '/api/v1/chat/suggested-prompts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ChatController::suggestedPrompts
* @see app/Http/Controllers/Api/ChatController.php:133
* @route '/api/v1/chat/suggested-prompts'
*/
suggestedPrompts.url = (options?: RouteQueryOptions) => {
    return suggestedPrompts.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ChatController::suggestedPrompts
* @see app/Http/Controllers/Api/ChatController.php:133
* @route '/api/v1/chat/suggested-prompts'
*/
suggestedPrompts.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: suggestedPrompts.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ChatController::suggestedPrompts
* @see app/Http/Controllers/Api/ChatController.php:133
* @route '/api/v1/chat/suggested-prompts'
*/
suggestedPrompts.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: suggestedPrompts.url(options),
    method: 'head',
})

const ChatController = { show, index, store, streamMessage, destroy, suggestedPrompts }

export default ChatController