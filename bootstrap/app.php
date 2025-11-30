<?php

use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Helpers\ErrorResponse;
use App\Exceptions\HttpException;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Application;
use Illuminate\Database\QueryException;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Auth\AuthenticationException;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Middleware\RoleMiddleware;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Spatie\Permission\Middleware\PermissionMiddleware;
use GusVasconcelos\MarkdownConverter\MarkdownConverter;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Spatie\Permission\Exceptions\UnauthorizedException;
use Spatie\Permission\Middleware\RoleOrPermissionMiddleware;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            HandleInertiaRequests::class,
        ]);

        $middleware->api(prepend: [
            EnsureFrontendRequestsAreStateful::class,
        ]);

        $middleware->alias([
            'role' => RoleMiddleware::class,
            'permission' => PermissionMiddleware::class,
            'role_or_permission' => RoleOrPermissionMiddleware::class,
        ]);

        $middleware->trustProxies(at: '*', headers: Request::HEADER_X_FORWARDED_FOR |
            Request::HEADER_X_FORWARDED_HOST |
            Request::HEADER_X_FORWARDED_PORT |
            Request::HEADER_X_FORWARDED_PROTO |
            Request::HEADER_X_FORWARDED_AWS_ELB);
    })
    ->withSchedule(function (Schedule $schedule) {
        $schedule->command('notifications:send')->everyMinute();
        $schedule->command('notifications:schedule')->dailyAt('00:00');
        $schedule->command('medications:mark-missed')->dailyAt('02:00');
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->dontReport([
            InvalidArgumentException::class,
            HttpException::class,
        ]);

        $exceptions->render(function (ValidationException $e, Request $req) {
            if ($req->expectsJson() || $req->is('api/*')) {
                return response()->json([
                    'message' => $e->getMessage(),
                    'errors' => $e->errors(),
                    'details' => $e->errors(),
                ], 422);
            }

            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput();
        });

        $exceptions->render(function (InvalidArgumentException $e, Request $req) {
            if ($req->expectsJson() || $req->is('api/*')) {
                return response()->json([
                    'message' => $e->getMessage(),
                    'error' => $e->getMessage(),
                ], 400);
            }

            return redirect()->back()->with('error', $e->getMessage());
        });

        $exceptions->render(function (AuthenticationException $e, Request $req) {
            if ($req->expectsJson() || $req->is('api/*')) {
                return response()->json([
                    'message' => 'Unauthenticated.',
                ], 401);
            }

            return redirect()->guest(route('login'));
        });

        $exceptions->render(function (AuthorizationException $e, Request $req) {
            if ($req->expectsJson() || $req->is('api/*')) {
                return response()->json([
                    'message' => 'This action is unauthorized.',
                ], 403);
            }

            return Inertia::render('Errors/Forbidden', [
                'status' => 403,
            ])->toResponse($req)->setStatusCode(403);
        });

        $exceptions->render(function (UnauthorizedException $e, Request $req) {
            if ($req->expectsJson() || $req->is('api/*')) {
                return response()->json([
                    'message' => 'User does not have the required role or permission.',
                ], 403);
            }

            return Inertia::render('Errors/Forbidden', [
                'status' => 403,
            ])->toResponse($req)->setStatusCode(403);
        });

        $exceptions->render(function (ModelNotFoundException $e, Request $req) {
            $model = $e->getModel();

            if ($req->expectsJson() || $req->is('api/*')) {
                return response()->json([
                    'message' => __('errors.resource_not_found', ['resource' => $model]),
                ], 404);
            }

            return redirect()->back()->with('error', __('errors.resource_not_found', ['resource' => $model]));
        });

        $exceptions->render(function (QueryException $e, Request $req) {
            $reqId = Str::uuid7()->toString();

            $userId = auth('web')->id() ?? 'N/A';

            $message = __('errors.query_not_acceptable');

            $errorResponse = new ErrorResponse(
                exception: $e,
                message: $message,
                statusCode: 406,
                errorCode: 'QUERY_NOT_ACCEPTABLE',
                reqId: $reqId,
            );

            $logMessage = MarkdownConverter::make()
                ->heading("**{$message}**", 1)
                ->paragraph('Request ID:')
                ->code($reqId)
                ->paragraph('User ID:')
                ->code($userId)
                ->paragraph('Error Code:')
                ->code('QUERY_NOT_ACCEPTABLE');

            Log::critical(
                message: $logMessage,
                context: $errorResponse->showStackTrace()->toArray()
            );

            if ($req->expectsJson() || $req->is('api/*')) {
                return response()->json([
                    'message' => $message,
                    'request_id' => $reqId,
                    'error_code' => 'QUERY_NOT_ACCEPTABLE',
                ], 406);
            }

            return redirect()->back()->with('error', $message);
        });

        $exceptions->render(function (NotFoundHttpException $e, Request $req) {
            if ($req->expectsJson() || $req->is('api/*')) {
                return response()->json([
                    'message' => 'Resource not found.',
                ], 404);
            }

            return Inertia::render('Errors/NotFound', [
                'status' => 404,
            ])->toResponse($req)->setStatusCode(404);
        });

        $exceptions->render(function (MethodNotAllowedHttpException $e, Request $req) {
            if ($req->expectsJson() || $req->is('api/*')) {
                return response()->json([
                    'message' => __('errors.method_not_allowed'),
                ], 405);
            }

            return redirect()->back()->with('error', __('errors.method_not_allowed'));
        });

        $exceptions->render(function (HttpException $e, Request $req) {
            $statusCode = $e->getStatusCode();

            if ($req->expectsJson() || $req->is('api/*')) {
                return response()->json([
                    'message' => $e->getMessage() ?: 'Server Error',
                    'status' => $statusCode,
                ], $statusCode);
            }

            $errorPage = match ($statusCode) {
                403 => 'Errors/Forbidden',
                404 => 'Errors/NotFound',
                503 => 'Errors/ServiceUnavailable',
                default => 'Errors/ServerError',
            };

            return Inertia::render($errorPage, [
                'status' => $statusCode,
            ])->toResponse($req)->setStatusCode($statusCode);
        });

        $exceptions->render(function (Throwable $e, Request $req) {
            $reqId = Str::uuid7()->toString();

            $userId = auth('web')->id() ?? 'N/A';

            $message = __('errors.internal_server');

            $errorResponse = new ErrorResponse(
                exception: $e,
                message: $message,
                statusCode: 500,
                errorCode: 'INTERNAL_SERVER_ERROR',
                reqId: $reqId,
            );

            $logMessage = MarkdownConverter::make()
                ->heading("**{$message}**", 1)
                ->paragraph('Request ID:')
                ->code($reqId)
                ->paragraph('User ID:')
                ->code($userId)
                ->paragraph('Error Code:')
                ->code('INTERNAL_SERVER_ERROR');

            Log::critical(
                message: $logMessage,
                context: $errorResponse->showStackTrace()->toArray()
            );

            if ($req->expectsJson() || $req->is('api/*')) {
                return response()->json([
                    'message' => $message,
                    'request_id' => $reqId,
                    'error_code' => 'INTERNAL_SERVER_ERROR',
                ], 500);
            }

            return Inertia::render('Errors/ServerError', [
                'status' => 500,
            ])->toResponse($req)->setStatusCode(500);
        });
    })->create();
