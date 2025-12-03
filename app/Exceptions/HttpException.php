<?php

namespace App\Exceptions;

use Exception;

class HttpException extends Exception
{
    public function __construct(
        string $message,
        protected int $statusCode,
        protected string $errorCode,
        protected string|array|null $errors = null
    ) {
        parent::__construct($message);
    }

    public function getStatusCode(): int
    {
        return $this->statusCode;
    }

    public function getErrorCode(): string
    {
        return $this->errorCode;
    }

    public function getErrors(): string|array|null
    {
        return $this->errors;
    }
}
