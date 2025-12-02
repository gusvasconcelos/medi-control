<?php

namespace App\Packages\Filter;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class FilterQ
{
    public static function apply(Builder $builder, ?Collection $queryParams = null): Builder
    {
        if ($queryParams === null || $queryParams->isEmpty()) {
            return $builder;
        }

        $q = collect(json_decode($queryParams->get('q'), true));

        if ($q->isEmpty()) {
            return $builder;
        }

        if ($q->has('where')) {
            $builder = Where::apply($builder, $q->get('where'));
        }

        if ($q->has('text')) {
            $builder = FullText::apply($builder, $q->get('text'));
        }

        if ($q->has('orderBy')) {
            $builder = OrderBy::apply($builder, $q->get('orderBy'));
        }

        return $builder;
    }

    public static function applyWithPagination(Builder $builder, ?Collection $queryParams = null): LengthAwarePaginator
    {
        $builder = self::apply($builder, $queryParams);

        $perPage = $queryParams->get('per_page', 15);

        $page = $queryParams->get('page', 1);

        return Pagination::apply($builder, $perPage, $page);
    }
}
