<?php

namespace App\Packages\Filter;

use Illuminate\Database\Eloquent\Builder;

final class OrderBy
{
    protected const ALLOWED_DIRECTIONS = [
        'ASC',
        'DESC',
    ];

    public static function apply(Builder $builder, array $orderByConditions): Builder
    {
        if (empty($orderByConditions)) {
            return $builder;
        }

        foreach ($orderByConditions as $condition) {
            $field = $condition['field'] ?? null;
            $direction = strtoupper($condition['direction'] ?? 'ASC');

            if (! $field) {
                continue;
            }

            if (! in_array($direction, self::ALLOWED_DIRECTIONS, true)) {
                $direction = 'ASC';
            }

            $builder->orderBy($field, $direction);
        }

        return $builder;
    }
}
