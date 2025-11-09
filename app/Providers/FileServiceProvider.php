<?php

namespace App\Providers;

use App\Http\Controllers\Api\FileController;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;

class FileServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Route::macro('file', function (string $resource) {
            $parameter = Str::singular($resource);

            $modelClass = 'App\\Models\\' . Str::studly($parameter);

            if (! class_exists($modelClass)) {
                throw new \InvalidArgumentException("Model {$modelClass} does not exist");
            }

            Route::group([
                'prefix' => "{$resource}/{{$parameter}}/files",
                'middleware' => ['api', 'jwt'],
            ], function () use ($modelClass) {
                Route::get('/', [FileController::class, 'index'])->defaults('modelClass', $modelClass);
                Route::post('/', [FileController::class, 'store'])->defaults('modelClass', $modelClass);
                Route::get('/{file}', [FileController::class, 'show'])->defaults('modelClass', $modelClass);
                Route::put('/{file}', [FileController::class, 'update'])->defaults('modelClass', $modelClass);
                Route::delete('/{file}', [FileController::class, 'destroy'])->defaults('modelClass', $modelClass);
            });
        });
    }
}
