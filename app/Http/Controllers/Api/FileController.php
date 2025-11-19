<?php

namespace App\Http\Controllers\Api;

use App\Models\File;
use App\Services\FileService;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Model;
use App\Http\Requests\File\StoreFileRequest;
use App\Http\Requests\File\UpdateFileRequest;

class FileController extends Controller
{
    public function __construct(
        protected FileService $fileService
    ) {
    }

    public function index(Model $fileable): JsonResponse
    {
        $filePaginator = $this->fileService->index($fileable);

        return response()->json($filePaginator);
    }

    public function store(StoreFileRequest $request, Model $fileable): JsonResponse
    {
        $validated = $request->validated();

        $file = $this->fileService->store(collect($validated), $fileable);

        return response()->json([
            'message' => __('files.created'),
            'data' => $file,
        ]);
    }

    public function show(Model $fileable, File $file): JsonResponse
    {
        return response()->json(['data' => $file]);
    }

    public function update(UpdateFileRequest $request, Model $fileable, File $file): JsonResponse
    {
        $validated = $request->validated();

        $file = $this->fileService->update(collect($validated), $file);

        return response()->json([
            'message' => __('files.updated'),
            'data' => $file,
        ]);
    }

    public function destroy(Model $fileable, File $file): JsonResponse
    {
        $this->fileService->destroy($file);

        return response()->json([
            'message' => __('files.deleted'),
        ]);
    }
}
