<?php

namespace App\Services;

use Illuminate\Support\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\Permission\Models\Role;
use App\Packages\Filter\FilterQ;

class RoleService
{
    public function __construct(
        protected Role $role
    ) {
    }

    public function index(Collection $data): LengthAwarePaginator|Collection
    {
        $query = $this->role->with(['permissions']);

        if ($data->has('all') && $data->get('all') === 'true') {
            return $query->get();
        }

        return FilterQ::applyWithPagination($query, $data);
    }

    public function show(int $id): Role
    {
        return $this->role->with(['permissions'])->findOrFail($id);
    }

    public function store(Collection $data): Role
    {
        $role = $this->role->create([
            'name' => $data->get('name'),
            'display_name' => $data->get('display_name'),
            'description' => $data->get('description'),
            'guard_name' => 'web',
        ]);

        if ($data->has('permissions') && is_array($data->get('permissions'))) {
            $role->syncPermissions($data->get('permissions'));
        }

        return $role->load('permissions');
    }

    public function update(int $id, Collection $data): Role
    {
        $role = $this->role->findOrFail($id);

        $role->update([
            'name' => $data->get('name'),
            'display_name' => $data->get('display_name'),
            'description' => $data->get('description'),
        ]);

        if ($data->has('permissions') && is_array($data->get('permissions'))) {
            $role->syncPermissions($data->get('permissions'));
        }

        return $role->load('permissions');
    }

    public function destroy(int $id): void
    {
        $role = $this->role->findOrFail($id);
        $role->delete();
    }

    public function syncPermissions(int $id, array $permissionIds): Role
    {
        $role = $this->role->findOrFail($id);
        $role->syncPermissions($permissionIds);

        return $role->load('permissions');
    }

    /**
     * Get roles that users can self-select during registration.
     *
     * @return Collection<int, Role>
     */
    public function getSelectableRoles(): Collection
    {
        return $this->role
            ->whereIn('name', ['patient', 'caregiver'])
            ->where('guard_name', 'web')
            ->get(['id', 'name', 'display_name', 'description']);
    }
}

