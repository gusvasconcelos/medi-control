<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\RoleService;

class RoleController extends Controller
{
    public function __construct(
        protected RoleService $roleService
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $data = $request->all();

        $roles = $this->roleService->index(collect($data));

        return response()->json($roles);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'display_name' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role = $this->roleService->store(collect($validated));

        return response()->json([
            'message' => 'Role criada com sucesso',
            'data' => $role,
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $role = $this->roleService->show($id);

        return response()->json(['data' => $role]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'name' => "required|string|max:255|unique:roles,name,{$id}",
            'display_name' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role = $this->roleService->update($id, collect($validated));

        return response()->json([
            'message' => 'Role atualizada com sucesso',
            'data' => $role,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->roleService->destroy($id);

        return response()->json([
            'message' => 'Role removida com sucesso',
        ]);
    }

    public function syncPermissions(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role = $this->roleService->syncPermissions($id, $validated['permissions']);

        return response()->json([
            'message' => 'Permissões sincronizadas com sucesso',
            'data' => $role,
        ]);
    }

    /**
     * Get roles available for user self-selection (patient, caregiver).
     */
    public function selectable(): JsonResponse
    {
        $roles = $this->roleService->getSelectableRoles();

        return response()->json(['data' => $roles]);
    }
}
