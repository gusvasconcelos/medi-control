<?php

namespace App\Exceptions;

class UnprocessableEntityException extends HttpException
{
    public function __construct(
        string $message,
        string $errorCode = 'UNPROCESSABLE_ENTITY',
        string|array|null $errors = null
    ) {
        parent::__construct($message, 422, $errorCode, $errors);
    }
}
