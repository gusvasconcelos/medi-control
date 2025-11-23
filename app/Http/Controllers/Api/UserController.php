<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
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

    /**
     * Allow authenticated user to select their role (patient or caregiver).
     */
    public function selectRole(Request $request): JsonResponse
    {
        $request->validate([
            'role' => ['required', 'string', Rule::in(['patient', 'caregiver'])],
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();

        try {
            $user = $this->userService->selectRole($user, $request->input('role'));

            return response()->json([
                'message' => 'Perfil configurado com sucesso',
                'data' => $user,
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}
