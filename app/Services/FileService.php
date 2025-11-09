<?php

namespace App\Services;

use App\Models\File;
use Illuminate\Support\Str;
use App\Packages\Filter\FilterQ;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use App\Services\FileUpload\AdapterFactory;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Services\FileStorageService;

class FileService
{
    /**
     * The class name of the fileable model.
     *
     * @var string
     */
    protected string $fileableClass;

    public function __construct()
    {
        $this->fileableClass = Route::current()->defaults['modelClass'];
    }

    public function index(int $fileableId): LengthAwarePaginator
    {
        $fileable = $this->fileableClass::findOrFail($fileableId);

        $query = File::active()->byFileable($fileable);

        return FilterQ::applyWithPagination($query);
    }

    public function show(int $fileableId, int $fileId): File
    {
        return File::active()
            ->where('fileable_id', $fileableId)
            ->where('fileable_type', $this->fileableClass)
            ->findOrFail($fileId);
    }

    public function store(Collection $data, int $fileableId): File
    {
        $fileable = $this->fileableClass::findOrFail($fileableId);

        $fileData = $data->toArray();

        $adapter = AdapterFactory::make($fileData);

        $uploadedFileData = $adapter->upload($fileData);

        return DB::transaction(function () use ($data, $fileableId) {
            $fileable = $this->fileableClass::findOrFail($fileableId);

            $adapter = AdapterFactory::make($data->toArray());
            $uploadedFileInfo = $adapter->upload($data->toArray());

            $storageResult = FileStorageService::put(
                tempPath: $uploadedFileInfo->tempPath,
                uploadedBy: auth('api')->id(),
                fileableType: $this->fileableClass,
                originalName: $uploadedFileInfo->originalName,
                disk: $data->get('disk', 's3')
            );

            $metadata = array_merge(
                $uploadedFileInfo->metadata ?? [],
                $data->get('metadata', [])
            );

            $file = $fileable->files()->create([
                'uploaded_by' => auth('api')->id(),
                'original_name' => $uploadedFileInfo->originalName,
                'stored_name' => $storageResult['stored_name'],
                'path' => $storageResult['path'],
                'disk' => $data->get('disk', 's3'),
                'mime_type' => $uploadedFileInfo->mimeType,
                'size' => $uploadedFileInfo->size,
                'visibility' => $data->get('visibility', 'private'),
                'metadata' => $metadata,
            ]);

            $this->cleanupTempFile($uploadedFileInfo->tempPath);

            return $file;
        });
    }

    public function update(int $id, Collection $data): File
    {
        $file = File::active()->findOrFail($id);

        $updateData = [];

        if ($data->has('visibility')) {
            $updateData['visibility'] = $data->get('visibility');
        }

        if ($data->has('metadata')) {
            $updateData['metadata'] = array_merge(
                $file->metadata ?? [],
                $data->get('metadata')
            );
        }

        if (!empty($updateData)) {
            $file->update($updateData);
        }

        return $file->fresh();
    }

    public function destroy(int $fileableId, int $id): void
    {
        $fileable = $this->fileableClass::findOrFail($fileableId);

        $file = $fileable->files()->active()->findOrFail($id);

        $file->update(['active' => false]);

        FileStorageService::delete($file->path, $file->disk);
    }

    private function cleanupTempFile(string $tempPath): void
    {
        if (file_exists($tempPath) && str_starts_with($tempPath, sys_get_temp_dir())) {
            @unlink($tempPath);
        }
    }
}
