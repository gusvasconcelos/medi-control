<?php

namespace App\Console\Commands;

use InvalidArgumentException;
use function Laravel\Prompts\confirm;

use Illuminate\Console\GeneratorCommand;
use Symfony\Component\Console\Input\InputOption;

class ServiceMakeCommand extends GeneratorCommand
{
    protected $signature = 'make:service {name} {--model=}';

    protected $description = 'Create a new service class';

    protected $type = 'Service';

    protected function getStub(): string
    {
        if ($this->option('model')) {
            return base_path('stubs/service.model.stub');
        }

        return base_path('stubs/service.stub');
    }

    protected function getDefaultNamespace($rootNamespace): string
    {
        return "{$rootNamespace}\Services";
    }

    protected function buildClass($name): string
    {
        $serviceNamespace = $this->getNamespace($name);
        $serviceName = class_basename($name);

        $replace = [
            '{{ namespace }}' => $serviceNamespace,
            '{{ class }}' => $serviceName,
        ];

        if ($this->option('model')) {
            $replace = $this->buildModelReplacements($replace);
        }

        return str_replace(
            array_keys($replace),
            array_values($replace),
            parent::buildClass($name)
        );
    }

    protected function buildModelReplacements(array $replace): array
    {
        $modelClass = $this->parseModel($this->option('model'));

        if (! class_exists($modelClass) && confirm("A {$modelClass} model does not exist. Do you want to generate it?", default: true)) {
            $this->call('make:model', ['name' => $modelClass]);
        }

        return array_merge($replace, [
            '{{ namespacedModel }}' => $modelClass,
            '{{ model }}' => class_basename($modelClass),
            '{{ modelVariable }}' => lcfirst(class_basename($modelClass)),
        ]);
    }

    protected function buildModelCrudReplacements(array $replace): array
    {
        return $replace;
    }

    protected function parseModel($model)
    {
        if (preg_match('([^A-Za-z0-9_/\\\\])', $model)) {
            throw new InvalidArgumentException('Model name contains invalid characters.');
        }

        return $this->qualifyModel($model);
    }

    protected function getOptions()
    {
        return [
            ['model', 'm', InputOption::VALUE_OPTIONAL, 'Generate a service class for the given model'],
        ];
    }
}
