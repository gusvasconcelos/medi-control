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
}
