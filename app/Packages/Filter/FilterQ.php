<?php

namespace App\Packages\Filter;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

class FilterQ
{
    public static function apply(Builder $builder, ?Request $request = null): Builder
    {
        $request = $request ?? request();

        $queryParams = collect(json_decode($request->query('q'), true));

        if ($queryParams->isEmpty()) {
            return $builder;
        }

        if ($queryParams->has('where')) {
            $builder = Where::apply($builder, $queryParams->get('where'));
        }

        if ($queryParams->has('orderBy')) {
            $builder = OrderBy::apply($builder, $queryParams->get('orderBy'));
        }

        return $builder;
    }

    public static function applyWithPagination(Builder $builder, ?Request $request = null): LengthAwarePaginator
    {
        $request = $request ?? request();

        $builder = self::apply($builder, $request);

        $perPage = $request->query('per_page', 15);

        $page = $request->query('page', 1);

        return Pagination::apply($builder, $perPage, $page);
    }
}
