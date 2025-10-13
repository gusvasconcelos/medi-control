<?php

namespace App\Exceptions;

class UnprocessableEntityException extends HttpException
{
    public function __construct(
        string $message,
        string $errorCode = 'UNPROCESSABLE_ENTITY',
        string|array|null $details = null
    ) {
        parent::__construct($message, 422, $errorCode, $details);
    }
}
