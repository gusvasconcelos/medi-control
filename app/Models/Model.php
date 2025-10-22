<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Model as EloquentModel;

abstract class Model extends EloquentModel
{
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
    }

    #[Scope]
    public function whereLike(Builder $query, string $field, ?string $value): Builder
    {
        if (is_null($value)) {
            return $query;
        }

        return $query->where($field, 'LIKE', "%{$value}%");
    }

    #[Scope]
    public function orWhereLike(Builder $query, string $field, ?string $value): Builder
    {
        if (is_null($value)) {
            return $query;
        }

        return $query->orWhere($field, 'LIKE', "%{$value}%");
    }

    #[Scope]
    public function whereInsensitiveLike(Builder $query, string $field, ?string $value): Builder
    {
        if (is_null($value)) {
            return $query;
        }

        return $query->where($field, 'ILIKE', "%{$value}%");
    }

    #[Scope]
    public function orWhereInsensitiveLike(Builder $query, string $field, ?string $value): Builder
    {
        if (is_null($value)) {
            return $query;
        }

        return $query->orWhere($field, 'ILIKE', "%{$value}%");
    }

    #[Scope]
    public function searchField(Builder $query, string $field, ?string $search): Builder
    {
        if (is_null($search) || trim($search) === '') {
            return $query;
        }

        $unaccented = cast()->unaccent($search);

        return $query->where(function (Builder $q) use ($field, $unaccented) {
            $q->whereRaw("UNACCENT({$field})::text ILIKE ?", ["%{$unaccented}%"]);
        });
    }
}
