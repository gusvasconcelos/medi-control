<?php

namespace App\Exceptions;

class UnauthorizedException extends HttpException
{
    public function __construct(
        string $message,
        string $errorCode = 'UNAUTHORIZED',
        string|array|null $details = null
    ) {
        parent::__construct($message, 401, $errorCode, $details);
    }
}
