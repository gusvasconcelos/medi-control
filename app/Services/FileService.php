<?php

namespace App\Services;

use App\Models\File;
use App\Packages\Filter\FilterQ;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Model;
use App\Services\FileUpload\AdapterFactory;
use Illuminate\Pagination\LengthAwarePaginator;

class FileService
{
    public function index(Model $fileable): LengthAwarePaginator
    {
        $query = $fileable->files()->active()->getQuery();

        return FilterQ::applyWithPagination($query);
    }

    public function store(Collection $data, Model $fileable): File
    {
        $fileData = $data->toArray();

        $adapter = AdapterFactory::make($fileData);

        $uploadedFileData = $adapter->upload($fileData);

        $storageResult = FileStorageService::put(
            tempPath: $uploadedFileData->tempPath,
            uploadedBy: auth('api')->id(),
            fileableType: get_class($fileable),
            originalName: $uploadedFileData->originalName,
            disk: $data->get('disk', 's3')
        );

        $metadata = array_merge(
            $uploadedFileData->metadata ?? [],
            $data->get('metadata', [])
        );

        $file = $fileable->files()->create([
            'uploaded_by' => auth('api')->id(),
            'original_name' => $uploadedFileData->originalName,
            'stored_name' => $storageResult['stored_name'],
            'path' => $storageResult['path'],
            'disk' => $data->get('disk', 's3'),
            'mime_type' => $uploadedFileData->mimeType,
            'size' => $uploadedFileData->size,
            'visibility' => $data->get('visibility', 'private'),
            'metadata' => $metadata,
        ]);

        $this->cleanupTempFile($uploadedFileData->tempPath);

        return $file;
    }

    public function update(Collection $data, File $file): File
    {
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

        if (! empty($updateData)) {
            $file->update($updateData);
        }

        return $file->fresh();
    }

    public function destroy(File $file): void
    {
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
