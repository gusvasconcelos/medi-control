import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see routes/web.php:50
* @route '/reports'
*/
export const adherence = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: adherence.url(options),
    method: 'get',
})

adherence.definition = {
    methods: ["get","head"],
    url: '/reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:50
* @route '/reports'
*/
adherence.url = (options?: RouteQueryOptions) => {
    return adherence.definition.url + queryParams(options)
}

/**
* @see routes/web.php:50
* @route '/reports'
*/
adherence.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: adherence.url(options),
    method: 'get',
})

/**
* @see routes/web.php:50
* @route '/reports'
*/
adherence.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: adherence.url(options),
    method: 'head',
})

const reports = {
    adherence: Object.assign(adherence, adherence),
}

export default reports