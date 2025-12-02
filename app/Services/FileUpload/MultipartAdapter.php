<?php

namespace App\Services\FileUpload;

use App\Exceptions\UnprocessableEntityException;
use Illuminate\Http\UploadedFile;

class MultipartAdapter implements FileUploadAdapter
{
    public function upload(array $data): UploadedFileInfo
    {
        $file = $data['file'] ?? null;

        if (!$file instanceof UploadedFile) {
            throw new UnprocessableEntityException(
                __('files.file_required'),
                'FILE_REQUIRED'
            );
        }

        if (!$file->isValid()) {
            throw new UnprocessableEntityException(
                __('files.invalid_file'),
                'INVALID_FILE'
            );
        }

        return new UploadedFileInfo(
            originalName: $file->getClientOriginalName(),
            mimeType: $file->getMimeType(),
            size: $file->getSize(),
            tempPath: $file->getRealPath(),
            metadata: [
                'upload_method' => 'multipart',
                'client_extension' => $file->getClientOriginalExtension(),
            ]
        );
    }
}
