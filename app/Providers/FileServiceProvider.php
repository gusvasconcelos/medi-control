<?php

namespace App\Providers;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use App\Http\Controllers\Api\FileController;

class FileServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Route::bind('fileableId', function ($value, $route) {
            $routeName = $route->getName();

            $parts = explode('.', $routeName);

            $resource = $parts[1] ?? null;

            if (! $resource) {
                throw new \InvalidArgumentException("Cannot extract resource from route name: {$routeName}");
            }

            $model = Str::studly(Str::singular($resource));

            $modelClassName = 'App\\Models\\' . $model;

            if (! class_exists($modelClassName)) {
                throw new \InvalidArgumentException("Model {$modelClassName} does not exist");
            }

            return $modelClassName::findOrFail($value);
        });

        Route::macro('file', function (string $resource) {
            Route::group([
                'prefix' => "{$resource}/{fileableId}/files",
                'middleware' => ['api', 'jwt'],
            ], function () use ($resource) {
                Route::get('/', [FileController::class, 'index'])->name("file.{$resource}.index");
                Route::post('/', [FileController::class, 'store'])->name("file.{$resource}.store");
                Route::get('/{file}', [FileController::class, 'show'])->name("file.{$resource}.show");
                Route::put('/{file}', [FileController::class, 'update'])->name("file.{$resource}.update");
                Route::delete('/{file}', [FileController::class, 'destroy'])->name("file.{$resource}.destroy");
            });
        });
    }
}
