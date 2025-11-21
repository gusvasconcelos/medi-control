<?php

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Helpers\ErrorResponse;
use App\Exceptions\HttpException;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Application;
use Illuminate\Database\QueryException;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use GusVasconcelos\MarkdownConverter\MarkdownConverter;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Illuminate\Auth\AuthenticationException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            HandleInertiaRequests::class,
        ]);

        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);

        $middleware->trustProxies(at: '*', headers: Request::HEADER_X_FORWARDED_FOR |
            Request::HEADER_X_FORWARDED_HOST |
            Request::HEADER_X_FORWARDED_PORT |
            Request::HEADER_X_FORWARDED_PROTO |
            Request::HEADER_X_FORWARDED_AWS_ELB);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->dontReport([
            InvalidArgumentException::class,
            HttpException::class,
        ]);

        $reqId = Str::uuid7()->toString();

        $exceptions->render(function (ValidationException $e) use ($reqId) {
            $errorResponse = new ErrorResponse(
                exception: $e,
                message: __('errors.validation'),
                statusCode: 422,
                errorCode: 'VALIDATION',
                reqId: $reqId,
                details: $e->errors()
            );

            return $errorResponse->toJsonResponse();
        });

        $exceptions->render(function (InvalidArgumentException $e) use ($reqId) {
            $errorResponse = new ErrorResponse(
                exception: $e,
                message: $e->getMessage(),
                statusCode: 422,
                errorCode: 'INVALID_ARGUMENT',
                reqId: $reqId,
            );

            return $errorResponse->toJsonResponse();
        });

        $exceptions->render(function (AuthenticationException $e, Request $request) use ($reqId) {
            if ($request->expectsJson()) {
                $errorResponse = new ErrorResponse(
                    exception: $e,
                    message: __('errors.unauthenticated'),
                    statusCode: 401,
                    errorCode: 'UNAUTHENTICATED',
                    reqId: $reqId,
                );

                return $errorResponse->toJsonResponse();
            }

            return redirect()->guest(route('login'));
        });

        $exceptions->render(function (AuthorizationException $e) use ($reqId) {
            $errorResponse = new ErrorResponse(
                exception: $e,
                message: __('errors.unauthorized'),
                statusCode: 403,
                errorCode: 'FORBIDDEN',
                reqId: $reqId,
            );

            return $errorResponse->toJsonResponse();
        });

        $exceptions->render(function (ModelNotFoundException $e) use ($reqId) {
            $model = $e->getModel();

            $ids = implode(', ', $e->getIds());

            $errorResponse = new ErrorResponse(
                exception: $e,
                message: __('errors.resource_not_found', ['resource' => $model]),
                statusCode: 404,
                errorCode: 'RESOURCE_NOT_FOUND',
                reqId: $reqId,
                details: ['IDs: ' => $ids]
            );

            return $errorResponse->toJsonResponse();
        });

        $exceptions->render(function (QueryException $e) use ($reqId) {
            $userId = auth()->id() ?? 'N/A';

            $message = __('errors.query_not_acceptable');

            $errorResponse = new ErrorResponse(
                exception: $e,
                message: $message,
                statusCode: 406,
                errorCode: 'QUERY_NOT_ACCEPTABLE',
                reqId: $reqId,
            );

            $message = (new MarkdownConverter())
                ->heading("**{$message}**", 1)
                ->paragraph('Request ID:')
                ->code($reqId)
                ->paragraph('User ID:')
                ->code($userId)
                ->paragraph('Error Code:')
                ->code('QUERY_NOT_ACCEPTABLE');

            Log::critical(
                message: $message,
                context: $errorResponse->showStackTrace()->toArray()
            );

            return $errorResponse->toJsonResponse();
        });

        $exceptions->render(function (NotFoundHttpException $e, Request $req) use ($reqId) {
            $path = $req->path();

            $errorResponse = new ErrorResponse(
                exception: $e,
                message: __('errors.route_not_found', ['route' => $path]),
                statusCode: 404,
                errorCode: 'RESOURCE_NOT_FOUND',
                reqId: $reqId,
            );

            return $errorResponse->toJsonResponse();
        });

        $exceptions->render(function (MethodNotAllowedHttpException $e, Request $req) use ($reqId) {
            $method = $req->method();
            $path = $req->path();
            $allowedMethods = $e->getHeaders()['Allow'];

            $errorResponse = new ErrorResponse(
                exception: $e,
                message: __('errors.method_not_allowed', ['method' => $method, 'route' => $path, 'allowedMethods' => $allowedMethods]),
                statusCode: 405,
                errorCode: 'METHOD_NOT_ALLOWED',
                reqId: $reqId,
            );

            return $errorResponse->toJsonResponse();
        });

        $exceptions->render(function (HttpException $e) use ($reqId) {
            $errorResponse = new ErrorResponse(
                exception: $e,
                message: $e->getMessage(),
                statusCode: $e->getStatusCode(),
                errorCode: $e->getErrorCode(),
                reqId: $reqId,
                details: $e->getDetails()
            );

            return $errorResponse->toJsonResponse();
        });

        $exceptions->render(function (Throwable $e) use ($reqId) {
            $userId = auth()->id() ?? 'N/A';

            $message = __('errors.internal_server');

            $errorResponse = new ErrorResponse(
                exception: $e,
                message: $message,
                statusCode: 500,
                errorCode: 'INTERNAL_SERVER_ERROR',
                reqId: $reqId,
            );

            $message = (new MarkdownConverter())
                ->heading("**{$message}**", 1)
                ->paragraph('Request ID:')
                ->code($reqId)
                ->paragraph('User ID:')
                ->code($userId)
                ->paragraph('Error Code:')
                ->code('INTERNAL_SERVER_ERROR');

            Log::critical(
                message: $message,
                context: $errorResponse->showStackTrace()->toArray()
            );

            return $errorResponse->toJsonResponse();
        });
    })->create();
