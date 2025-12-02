<?php

namespace App\Packages\Filter;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class Pagination
{
    public static function apply(
        Builder $builder,
        int $perPage,
        int $page
    ): LengthAwarePaginator {
        return $builder->paginate($perPage, ['*'], 'page', $page);
    }
}
