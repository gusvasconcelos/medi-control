<?php

namespace App\Packages\Filter;

class FilterQueryBuilder
{
    protected array $where = [];

    protected array $orderBy = [];

    protected ?array $paginate = null;

    public static function make(): self
    {
        return new self();
    }

    public function where(string $field, string $operator, mixed $value): self
    {
        $this->where[] = [
            'field' => $field,
            'operator' => $operator,
            'value' => $value,
        ];

        return $this;
    }

    public function whereEqual(string $field, mixed $value): self
    {
        return $this->where($field, '=', $value);
    }

    public function whereNotEqual(string $field, mixed $value): self
    {
        return $this->where($field, '!=', $value);
    }

    public function whereGreaterThan(string $field, mixed $value): self
    {
        return $this->where($field, '>', $value);
    }

    public function whereLessThan(string $field, mixed $value): self
    {
        return $this->where($field, '<', $value);
    }

    public function whereGreaterThanOrEqual(string $field, mixed $value): self
    {
        return $this->where($field, '>=', $value);
    }

    public function whereLessThanOrEqual(string $field, mixed $value): self
    {
        return $this->where($field, '<=', $value);
    }

    public function whereLike(string $field, string $value): self
    {
        return $this->where($field, 'LIKE', $value);
    }

    public function whereIn(string $field, array $values): self
    {
        return $this->where($field, 'IN', $values);
    }

    public function whereNotIn(string $field, array $values): self
    {
        return $this->where($field, 'NOT IN', $values);
    }

    public function whereBetween(string $field, mixed $min, mixed $max): self
    {
        return $this->where($field, 'BETWEEN', [$min, $max]);
    }

    public function whereNull(string $field): self
    {
        return $this->where($field, 'IS NULL', null);
    }

    public function whereNotNull(string $field): self
    {
        return $this->where($field, 'IS NOT NULL', null);
    }

    public function orderBy(string $field, string $direction = 'ASC'): self
    {
        $this->orderBy[] = [
            'field' => $field,
            'direction' => strtoupper($direction),
        ];

        return $this;
    }

    public function orderByAsc(string $field): self
    {
        return $this->orderBy($field, 'ASC');
    }

    public function orderByDesc(string $field): self
    {
        return $this->orderBy($field, 'DESC');
    }

    public function paginate(int $perPage, int $page = 1): self
    {
        $this->paginate = [
            'per_page' => $perPage,
            'page' => $page,
        ];

        return $this;
    }

    public function toArray(): array
    {
        $result = [];

        if (! empty($this->where)) {
            $result['where'] = $this->where;
        }

        if (! empty($this->orderBy)) {
            $result['orderBy'] = $this->orderBy;
        }

        if ($this->paginate !== null) {
            $result['paginate'] = $this->paginate;
        }

        return $result;
    }

    public function toJson(): string
    {
        $flags = JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE;

        return json_encode($this->toArray(), $flags);
    }

    public function toQueryString(): string
    {
        return 'q=' . urlencode($this->toJson());
    }

    public function reset(): self
    {
        $this->where = [];
        $this->orderBy = [];
        $this->paginate = null;

        return $this;
    }
}

