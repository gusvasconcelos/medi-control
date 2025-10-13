<?php

namespace App\Http\Schemas;

use OpenApi\Attributes\Schema;
use OpenApi\Attributes\Property;

#[Schema(
    schema: 'user',
    description: 'User data',
    type: 'object',
    required: ['id', 'name', 'email', 'created_at', 'updated_at']
)]
class UserSchema
{
    #[Property(
        property: 'id',
        description: 'Unique user ID',
        type: 'integer',
        format: 'int64',
        example: 1
    )]
    public int $id;

    #[Property(
        property: 'name',
        description: 'Full user name',
        type: 'string',
        example: 'John Doe'
    )]
    public string $name;

    #[Property(
        property: 'email',
        description: 'User email address',
        type: 'string',
        format: 'email',
        example: 'john.doe@example.com'
    )]
    public string $email;

    #[Property(
        property: 'email_verified_at',
        description: 'Email verification date and time',
        type: 'string',
        format: 'date-time',
        nullable: true,
        example: '2025-09-14T10:30:00Z'
    )]
    public ?string $email_verified_at;

    #[Property(
        property: 'created_at',
        description: 'User creation date and time',
        type: 'string',
        format: 'date-time',
        example: '2025-09-14T10:30:00Z'
    )]
    public string $created_at;

    #[Property(
        property: 'updated_at',
        description: 'Last update date and time',
        type: 'string',
        format: 'date-time',
        example: '2025-09-14T10:30:00Z'
    )]
    public string $updated_at;
}
