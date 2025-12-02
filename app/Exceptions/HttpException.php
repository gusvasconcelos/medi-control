<?php

namespace App\Exceptions;

use Exception;

class HttpException extends Exception
{
    public function __construct(
        string $message,
        protected int $statusCode,
        protected string $errorCode,
        protected string|array|null $details = null
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

    public function getDetails(): string|array|null
    {
        return $this->details;
    }
}
