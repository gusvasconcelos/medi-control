<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\File\IndexFilesRequest;
use App\Http\Requests\File\StoreFileRequest;
use App\Http\Requests\File\UpdateFileRequest;
use App\Services\FileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Route;

class FileController extends Controller
{
    public function __construct(
        protected FileService $fileService
    ) {
        $this->fileService = $fileService;
    }

    public function index(int $fileableId): JsonResponse
    {
        $filePaginator = $this->fileService->index($fileableId);

        return response()->json($filePaginator);
    }

    public function store(StoreFileRequest $request, int $fileableId): JsonResponse
    {
        $validated = $request->validated();

        $file = $this->fileService->store(collect($validated), $fileableId);

        return response()->json([
            'message' => __('files.created'),
            'data' => $file,
        ]);
    }

    public function show(int $fileableId, int $fileId): JsonResponse
    {
        $file = $this->fileService->show($fileableId, $fileId);

        return response()->json(['data' => $file]);
    }

    public function update(UpdateFileRequest $request, int $fileableId, int $id): JsonResponse
    {
        $validated = $request->validated();

        $file = $this->fileService->update($id, collect($validated));

        return response()->json([
            'message' => __('files.updated'),
            'data' => $file,
        ]);
    }

    public function destroy(int $fileableId, int $id): JsonResponse
    {
        $this->fileService->destroy($fileableId, $id);

        return response()->json([
            'message' => __('files.deleted'),
        ]);
    }
}
