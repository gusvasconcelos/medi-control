<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\PermissionService;

class PermissionController extends Controller
{
    public function __construct(
        protected PermissionService $permissionService
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $data = $request->all();

        $permissions = $this->permissionService->index(collect($data));

        return response()->json($permissions);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name',
            'display_name' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'group' => 'nullable|string|max:100',
        ]);

        $permission = $this->permissionService->store(collect($validated));

        return response()->json([
            'message' => 'Permissão criada com sucesso',
            'data' => $permission,
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $permission = $this->permissionService->show($id);

        return response()->json(['data' => $permission]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'name' => "required|string|max:255|unique:permissions,name,{$id}",
            'display_name' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'group' => 'nullable|string|max:100',
        ]);

        $permission = $this->permissionService->update($id, collect($validated));

        return response()->json([
            'message' => 'Permissão atualizada com sucesso',
            'data' => $permission,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->permissionService->destroy($id);

        return response()->json([
            'message' => 'Permissão removida com sucesso',
        ]);
    }

    public function grouped(): JsonResponse
    {
        $permissions = $this->permissionService->getGrouped();

        return response()->json(['data' => $permissions]);
    }
}

