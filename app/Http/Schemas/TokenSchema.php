<?php

namespace App\Http\Schemas;

use OpenApi\Attributes\Schema;
use OpenApi\Attributes\Property;

#[Schema(
    schema: 'token',
    description: 'Response for successful JWT token request',
    type: 'object',
    required: ['access_token', 'token_type', 'expires_in']
)]
class TokenSchema
{
    #[Property(
        property: 'access_token',
        description: 'Access JWT token',
        type: 'string',
        example: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...'
    )]
    public string $access_token;

    #[Property(
        property: 'token_type',
        description: 'Token type',
        type: 'string',
        example: 'bearer'
    )]
    public string $token_type;

    #[Property(
        property: 'expires_in',
        description: 'Token expiration time in seconds',
        type: 'integer',
        example: 3600
    )]
    public int $expires_in;
}
