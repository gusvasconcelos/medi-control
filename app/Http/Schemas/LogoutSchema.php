<?php

namespace App\Http\Schemas;

use OpenApi\Attributes\Schema;
use OpenApi\Attributes\Property;

#[Schema(
    schema: 'logout',
    description: 'Logout schema',
    type: 'object',
    required: ['message']
)]
class LogoutSchema
{
    #[Property(
        property: 'message',
        description: 'Logout message',
        type: 'string',
        example: 'Logout successful'
    )]
    public string $message;
}
