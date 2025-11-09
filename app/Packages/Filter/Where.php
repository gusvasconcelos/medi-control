<?php

namespace App\Packages\Filter;

use Illuminate\Database\Eloquent\Builder;

final class Where
{
    protected const ALLOWED_OPERATORS = [
        '=',
        '!=',
        '>',
        '<',
        '>=',
        '<=',
        'LIKE',
        'IN',
        'NOT IN',
        'BETWEEN',
        'IS NULL',
        'IS NOT NULL',
    ];

    public static function apply(Builder $builder, array $conditions): Builder
    {
        if (empty($conditions)) {
            return $builder;
        }

        foreach ($conditions as $condition) {
            $field = $condition['field'] ?? null;
            $operator = $condition['operator'] ?? null;
            $value = $condition['value'] ?? null;

            if (! $field || ! $operator) {
                continue;
            }

            if (! in_array($operator, self::ALLOWED_OPERATORS, true)) {
                continue;
            }

            self::applyWhereCondition($builder, $field, $operator, $value);
        }

        return $builder;
    }

    protected static function applyWhereCondition(
        Builder $builder,
        string $field,
        string $operator,
        mixed $value
    ): void {
        match ($operator) {
            '=' => $builder->where($field, $value),
            '!=' => $builder->where($field, '!=', $value),
            '>' => $builder->where($field, '>', $value),
            '<' => $builder->where($field, '<', $value),
            '>=' => $builder->where($field, '>=', $value),
            '<=' => $builder->where($field, '<=', $value),
            'LIKE' => $builder->where($field, 'LIKE', $value),
            'IN' => $builder->whereIn($field, is_array($value) ? $value : [$value]),
            'NOT IN' => $builder->whereNotIn($field, is_array($value) ? $value : [$value]),
            'BETWEEN' => $builder->whereBetween($field, $value),
            'IS NULL' => $builder->whereNull($field),
            'IS NOT NULL' => $builder->whereNotNull($field),
            default => null,
        };
    }
}
