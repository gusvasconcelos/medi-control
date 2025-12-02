<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Packages\Filter\FilterQ;

class UserService
{
    public function __construct(
        protected User $user
    ) {
    }

    public function index(Collection $data): LengthAwarePaginator
    {
        return FilterQ::applyWithPagination($this->user->with('roles'), $data);
    }

    public function show(int $id): User
    {
        return $this->user->with('roles')->findOrFail($id);
    }

    public function updateRoles(int $userId, array $roleIds): User
    {
        $user = $this->user->findOrFail($userId);
        $user->syncRoles($roleIds);
        $user->load('roles');
        return $user;
    }

    /**
     * Assign a selectable role (patient or caregiver) to a user.
     * Only allows assignment if user doesn't already have one of these roles.
     *
     * @param User $user
     * @param string $roleName Must be 'patient' or 'caregiver'
     */
    public function selectRole(User $user, string $roleName): User
    {
        if (! in_array($roleName, ['patient', 'caregiver'], true)) {
            throw new \InvalidArgumentException('Invalid role. Must be patient or caregiver.');
        }

        if ($user->hasRole(['patient', 'caregiver'])) {
            throw new \InvalidArgumentException('User already has a role assigned.');
        }

        $user->assignRole($roleName);
        $user->load('roles');

        return $user;
    }
}
