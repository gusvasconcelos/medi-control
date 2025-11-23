<?php

namespace App\Services;

use Illuminate\Support\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\Permission\Models\Permission;
use App\Packages\Filter\FilterQ;

class PermissionService
{
    public function __construct(
        protected Permission $permission
    ) {
    }

    public function index(Collection $data): LengthAwarePaginator|Collection
    {
        $query = $this->permission->newQuery();

        // Filter by group if provided
        if ($data->has('group') && $data->get('group')) {
            $query->where('group', $data->get('group'));
        }

        if ($data->has('all') && $data->get('all') === 'true') {
            return $query->orderBy('group')->orderBy('name')->get();
        }

        return FilterQ::applyWithPagination($query->orderBy('group')->orderBy('name'), $data);
    }

    public function show(int $id): Permission
    {
        return $this->permission->with(['roles'])->findOrFail($id);
    }

    public function store(Collection $data): Permission
    {
        return $this->permission->create([
            'name' => $data->get('name'),
            'display_name' => $data->get('display_name'),
            'description' => $data->get('description'),
            'group' => $data->get('group'),
            'guard_name' => 'web',
        ]);
    }

    public function update(int $id, Collection $data): Permission
    {
        $permission = $this->permission->findOrFail($id);

        $permission->update([
            'name' => $data->get('name'),
            'display_name' => $data->get('display_name'),
            'description' => $data->get('description'),
            'group' => $data->get('group'),
        ]);

        return $permission;
    }

    public function destroy(int $id): void
    {
        $permission = $this->permission->findOrFail($id);
        $permission->delete();
    }

    public function getGrouped(): Collection
    {
        return $this->permission->all()
            ->groupBy('group')
            ->map(function ($permissions, $group) {
                return [
                    'group' => $group ?: 'Outros',
                    'permissions' => $permissions,
                ];
            })
            ->values();
    }
}

