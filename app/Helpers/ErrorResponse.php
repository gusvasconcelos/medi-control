<?php

namespace App\Helpers;

use Throwable;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\QueryException;
use Illuminate\Contracts\Support\Arrayable;

class ErrorResponse implements Arrayable
{
    protected bool $showStackTrace = false;

    public function __construct(
        protected Throwable $exception,
        protected string $message,
        protected int $statusCode,
        protected string $errorCode,
        protected string $reqId,
        protected string|array|null $details = null
    ) {
        //
    }

    public function toJsonResponse(): JsonResponse
    {
        return response()->json($this->toArray(), $this->statusCode);
    }

    public function toArray(): array
    {
        $response = [
            'req_id' => $this->reqId,
            'message' => $this->message,
            'status_code' => $this->statusCode,
            'code' => $this->errorCode,
        ];

        if ($this->details) {
            $response['details'] = $this->details;
        }

        if ($sql = $this->getSql()) {
            $response['sql'] = $sql;
        }

        if ($stack = $this->getStack()) {
            $response['stack'] = $stack;
        }

        return $response;
    }

    public function showStackTrace(): self
    {
        $this->showStackTrace = true;

        return $this;
    }

    private function getStack(): array
    {
        if (! $this->showStackTrace() && ! config('app.debug')) {
            return [];
        }

        $appPath = app_path();

        $getTrace = $this->exception->getTrace();

        $trace = array_filter($getTrace, function ($item) use ($appPath) {
            return Arr::exists($item, 'file') && Str::startsWith($item['file'], $appPath);
        });

        return [
            'file' => $this->exception->getFile(),
            'line' => $this->exception->getLine(),
            'message' => $this->exception->getMessage(),
            'trace' => $trace,
        ];
    }

    private function getSql(): array
    {
        if (! $this->exception instanceof QueryException) {
            return [];
        }

        $sql = $this->exception->getSql();

        $bindings = $this->exception->getBindings();

        return array_map(function ($binding) use ($sql) {
            $value = is_numeric($binding) ? $binding : "'$binding'";

            return preg_replace('/\?/', $value, $sql, 1);
        }, $bindings);
    }
}
