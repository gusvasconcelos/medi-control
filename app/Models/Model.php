<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Model as EloquentModel;
use Illuminate\Support\Carbon;

abstract class Model extends EloquentModel
{
    protected $searchable = [];

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
    }

    #[Scope]
    public function scopeWhereDate(Builder $query, string $field, Carbon $value): Builder
    {
        return $query->whereRaw("DATE({$field}) = ?", [$value->toDateString()]);
    }

    #[Scope]
    public function whereFullText(Builder $query, string $field, ?string $value): Builder
    {
        if (is_null($value) || trim($value) === '') {
            return $query;
        }

        $unaccented = cast()->unaccent($value);

        return $query->orWhereRaw("UNACCENT({$field})::text ILIKE ?", ["%{$unaccented}%"]);
    }

    #[Scope]
    public function search(Builder $query, ?string $value): Builder
    {
        if (is_null($value) || trim($value) === '') {
            return $query;
        }

        $searchable = $this->searchable ?: $this->getFillable();

        $query->where(function (Builder $q) use ($searchable, $value) {
            foreach ($searchable as $field) {
                $q->whereFullText($field, $value);
            }
        });

        return $query;
    }
}
