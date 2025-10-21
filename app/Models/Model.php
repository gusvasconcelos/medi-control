<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model as EloquentModel;

abstract class Model extends EloquentModel
{
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
    }

    public function scopeWhereLike(Builder $query, string $field, ?string $value): Builder
    {
        if (is_null($value)) {
            return $query;
        }

        return $query->where($field, 'LIKE', "%{$value}%");
    }

    public function scopeOrWhereLike(Builder $query, string $field, ?string $value): Builder
    {
        if (is_null($value)) {
            return $query;
        }

        return $query->orWhere($field, 'LIKE', "%{$value}%");
    }

    public function scopeWhereInsensitiveLike(Builder $query, string $field, ?string $value): Builder
    {
        if (is_null($value)) {
            return $query;
        }

        return $query->where($field, 'ILIKE', "%{$value}%");
    }

    public function scopeOrWhereInsensitiveLike(Builder $query, string $field, ?string $value): Builder
    {
        if (is_null($value)) {
            return $query;
        }

        return $query->orWhere($field, 'ILIKE', "%{$value}%");
    }
}
