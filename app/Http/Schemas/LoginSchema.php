<?php

namespace App\Http\Schemas;

use OpenApi\Attributes\Schema;
use OpenApi\Attributes\Property;

#[Schema(
    schema: 'login',
    description: 'Login schema',
    type: 'object',
    required: ['email', 'password'],
)]
class LoginSchema
{
    #[Property(
        property: 'email',
        description: 'User email',
        type: 'string',
        format: 'email',
        example: 'john.doe@example.com'
    )]
    public string $email;

    #[Property(
        property: 'password',
        description: 'User password',
        type: 'string',
        example: 'password',
        minLength: 8
    )]
    public string $password;
}
