import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\CaregiverPatientController::caregiverPermissions
* @see app/Http/Controllers/Api/CaregiverPatientController.php:131
* @route '/api/v1/caregiver-permissions'
*/
export const caregiverPermissions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: caregiverPermissions.url(options),
    method: 'get',
})

caregiverPermissions.definition = {
    methods: ["get","head"],
    url: '/api/v1/caregiver-permissions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\CaregiverPatientController::caregiverPermissions
* @see app/Http/Controllers/Api/CaregiverPatientController.php:131
* @route '/api/v1/caregiver-permissions'
*/
caregiverPermissions.url = (options?: RouteQueryOptions) => {
    return caregiverPermissions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\CaregiverPatientController::caregiverPermissions
* @see app/Http/Controllers/Api/CaregiverPatientController.php:131
* @route '/api/v1/caregiver-permissions'
*/
caregiverPermissions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: caregiverPermissions.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\CaregiverPatientController::caregiverPermissions
* @see app/Http/Controllers/Api/CaregiverPatientController.php:131
* @route '/api/v1/caregiver-permissions'
*/
caregiverPermissions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: caregiverPermissions.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\CaregiverPatientController::myCaregivers
* @see app/Http/Controllers/Api/CaregiverPatientController.php:19
* @route '/api/v1/my-caregivers'
*/
export const myCaregivers = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: myCaregivers.url(options),
    method: 'get',
})

myCaregivers.definition = {
    methods: ["get","head"],
    url: '/api/v1/my-caregivers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\CaregiverPatientController::myCaregivers
* @see app/Http/Controllers/Api/CaregiverPatientController.php:19
* @route '/api/v1/my-caregivers'
*/
myCaregivers.url = (options?: RouteQueryOptions) => {
    return myCaregivers.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\CaregiverPatientController::myCaregivers
* @see app/Http/Controllers/Api/CaregiverPatientController.php:19
* @route '/api/v1/my-caregivers'
*/
myCaregivers.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: myCaregivers.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\CaregiverPatientController::myCaregivers
* @see app/Http/Controllers/Api/CaregiverPatientController.php:19
* @route '/api/v1/my-caregivers'
*/
myCaregivers.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: myCaregivers.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\CaregiverPatientController::inviteCaregiver
* @see app/Http/Controllers/Api/CaregiverPatientController.php:49
* @route '/api/v1/my-caregivers/invite'
*/
export const inviteCaregiver = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: inviteCaregiver.url(options),
    method: 'post',
})

inviteCaregiver.definition = {
    methods: ["post"],
    url: '/api/v1/my-caregivers/invite',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\CaregiverPatientController::inviteCaregiver
* @see app/Http/Controllers/Api/CaregiverPatientController.php:49
* @route '/api/v1/my-caregivers/invite'
*/
inviteCaregiver.url = (options?: RouteQueryOptions) => {
    return inviteCaregiver.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\CaregiverPatientController::inviteCaregiver
* @see app/Http/Controllers/Api/CaregiverPatientController.php:49
* @route '/api/v1/my-caregivers/invite'
*/
inviteCaregiver.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: inviteCaregiver.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\CaregiverPatientController::updatePermissions
* @see app/Http/Controllers/Api/CaregiverPatientController.php:107
* @route '/api/v1/my-caregivers/{id}/permissions'
*/
export const updatePermissions = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatePermissions.url(args, options),
    method: 'put',
})

updatePermissions.definition = {
    methods: ["put"],
    url: '/api/v1/my-caregivers/{id}/permissions',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\CaregiverPatientController::updatePermissions
* @see app/Http/Controllers/Api/CaregiverPatientController.php:107
* @route '/api/v1/my-caregivers/{id}/permissions'
*/
updatePermissions.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updatePermissions.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\CaregiverPatientController::updatePermissions
* @see app/Http/Controllers/Api/CaregiverPatientController.php:107
* @route '/api/v1/my-caregivers/{id}/permissions'
*/
updatePermissions.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatePermissions.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\CaregiverPatientController::revokeAccess
* @see app/Http/Controllers/Api/CaregiverPatientController.php:97
* @route '/api/v1/my-caregivers/{id}/revoke'
*/
export const revokeAccess = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: revokeAccess.url(args, options),
    method: 'delete',
})

revokeAccess.definition = {
    methods: ["delete"],
    url: '/api/v1/my-caregivers/{id}/revoke',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\CaregiverPatientController::revokeAccess
* @see app/Http/Controllers/Api/CaregiverPatientController.php:97
* @route '/api/v1/my-caregivers/{id}/revoke'
*/
revokeAccess.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return revokeAccess.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\CaregiverPatientController::revokeAccess
* @see app/Http/Controllers/Api/CaregiverPatientController.php:97
* @route '/api/v1/my-caregivers/{id}/revoke'
*/
revokeAccess.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: revokeAccess.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\CaregiverPatientController::cancelInvitation
* @see app/Http/Controllers/Api/CaregiverPatientController.php:87
* @route '/api/v1/my-caregivers/{id}/cancel'
*/
export const cancelInvitation = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: cancelInvitation.url(args, options),
    method: 'delete',
})

cancelInvitation.definition = {
    methods: ["delete"],
    url: '/api/v1/my-caregivers/{id}/cancel',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\CaregiverPatientController::cancelInvitation
* @see app/Http/Controllers/Api/CaregiverPatientController.php:87
* @route '/api/v1/my-caregivers/{id}/cancel'
*/
cancelInvitation.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return cancelInvitation.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\CaregiverPatientController::cancelInvitation
* @see app/Http/Controllers/Api/CaregiverPatientController.php:87
* @route '/api/v1/my-caregivers/{id}/cancel'
*/
cancelInvitation.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: cancelInvitation.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\CaregiverPatientController::myPatients
* @see app/Http/Controllers/Api/CaregiverPatientController.php:30
* @route '/api/v1/my-patients'
*/
export const myPatients = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: myPatients.url(options),
    method: 'get',
})

myPatients.definition = {
    methods: ["get","head"],
    url: '/api/v1/my-patients',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\CaregiverPatientController::myPatients
* @see app/Http/Controllers/Api/CaregiverPatientController.php:30
* @route '/api/v1/my-patients'
*/
myPatients.url = (options?: RouteQueryOptions) => {
    return myPatients.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\CaregiverPatientController::myPatients
* @see app/Http/Controllers/Api/CaregiverPatientController.php:30
* @route '/api/v1/my-patients'
*/
myPatients.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: myPatients.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\CaregiverPatientController::myPatients
* @see app/Http/Controllers/Api/CaregiverPatientController.php:30
* @route '/api/v1/my-patients'
*/
myPatients.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: myPatients.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\CaregiverPatientController::pendingInvitations
* @see app/Http/Controllers/Api/CaregiverPatientController.php:41
* @route '/api/v1/my-patients/pending'
*/
export const pendingInvitations = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pendingInvitations.url(options),
    method: 'get',
})

pendingInvitations.definition = {
    methods: ["get","head"],
    url: '/api/v1/my-patients/pending',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\CaregiverPatientController::pendingInvitations
* @see app/Http/Controllers/Api/CaregiverPatientController.php:41
* @route '/api/v1/my-patients/pending'
*/
pendingInvitations.url = (options?: RouteQueryOptions) => {
    return pendingInvitations.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\CaregiverPatientController::pendingInvitations
* @see app/Http/Controllers/Api/CaregiverPatientController.php:41
* @route '/api/v1/my-patients/pending'
*/
pendingInvitations.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pendingInvitations.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\CaregiverPatientController::pendingInvitations
* @see app/Http/Controllers/Api/CaregiverPatientController.php:41
* @route '/api/v1/my-patients/pending'
*/
pendingInvitations.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pendingInvitations.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\CaregiverPatientController::acceptInvitation
* @see app/Http/Controllers/Api/CaregiverPatientController.php:66
* @route '/api/v1/my-patients/{id}/accept'
*/
export const acceptInvitation = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: acceptInvitation.url(args, options),
    method: 'post',
})

acceptInvitation.definition = {
    methods: ["post"],
    url: '/api/v1/my-patients/{id}/accept',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\CaregiverPatientController::acceptInvitation
* @see app/Http/Controllers/Api/CaregiverPatientController.php:66
* @route '/api/v1/my-patients/{id}/accept'
*/
acceptInvitation.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return acceptInvitation.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\CaregiverPatientController::acceptInvitation
* @see app/Http/Controllers/Api/CaregiverPatientController.php:66
* @route '/api/v1/my-patients/{id}/accept'
*/
acceptInvitation.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: acceptInvitation.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\CaregiverPatientController::rejectInvitation
* @see app/Http/Controllers/Api/CaregiverPatientController.php:77
* @route '/api/v1/my-patients/{id}/reject'
*/
export const rejectInvitation = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: rejectInvitation.url(args, options),
    method: 'delete',
})

rejectInvitation.definition = {
    methods: ["delete"],
    url: '/api/v1/my-patients/{id}/reject',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\CaregiverPatientController::rejectInvitation
* @see app/Http/Controllers/Api/CaregiverPatientController.php:77
* @route '/api/v1/my-patients/{id}/reject'
*/
rejectInvitation.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return rejectInvitation.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\CaregiverPatientController::rejectInvitation
* @see app/Http/Controllers/Api/CaregiverPatientController.php:77
* @route '/api/v1/my-patients/{id}/reject'
*/
rejectInvitation.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: rejectInvitation.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\CaregiverPatientController::show
* @see app/Http/Controllers/Api/CaregiverPatientController.php:124
* @route '/api/v1/caregiver-patient/{id}'
*/
export const show = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/caregiver-patient/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\CaregiverPatientController::show
* @see app/Http/Controllers/Api/CaregiverPatientController.php:124
* @route '/api/v1/caregiver-patient/{id}'
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
* @see \App\Http\Controllers\Api\CaregiverPatientController::show
* @see app/Http/Controllers/Api/CaregiverPatientController.php:124
* @route '/api/v1/caregiver-patient/{id}'
*/
show.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\CaregiverPatientController::show
* @see app/Http/Controllers/Api/CaregiverPatientController.php:124
* @route '/api/v1/caregiver-patient/{id}'
*/
show.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

const CaregiverPatientController = { caregiverPermissions, myCaregivers, inviteCaregiver, updatePermissions, revokeAccess, cancelInvitation, myPatients, pendingInvitations, acceptInvitation, rejectInvitation, show }

export default CaregiverPatientController