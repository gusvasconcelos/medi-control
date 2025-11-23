<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\UserService;

class UserController extends Controller
{
    public function __construct(
        protected UserService $userService
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $data = $request->all();

        $users = $this->userService->index(collect($data));

        return response()->json($users);
    }

    public function show(int $id): JsonResponse
    {
        $user = $this->userService->show($id);

        return response()->json($user);
    }

    public function updateRoles(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'roles' => 'required|array',
            'roles.*' => 'integer|exists:roles,id',
        ]);

        $user = $this->userService->updateRoles($id, $request->input('roles'));

        return response()->json([
            'message' => 'Roles atualizadas com sucesso',
            'data' => $user,
        ]);
    }
}
