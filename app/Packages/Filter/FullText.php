<?php

namespace App\Packages\Filter;

use Illuminate\Database\Eloquent\Builder;

final class FullText
{
    public static function apply(Builder $builder, string $value): Builder
    {
        return $builder->search($value);
    }
}
