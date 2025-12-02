<?php

namespace App\Services\FileUpload;

use App\Exceptions\UnprocessableEntityException;
use Illuminate\Support\Str;

class Base64Adapter implements FileUploadAdapter
{
    public function upload(array $data): UploadedFileInfo
    {
        $base64String = $data['file'] ?? null;
        $originalName = $data['original_name'] ?? 'file';

        if (!$base64String) {
            throw new UnprocessableEntityException(
                __('files.base64_required'),
                'BASE64_FILE_REQUIRED'
            );
        }

        $fileData = $this->decodeBase64($base64String);
        $tempPath = $this->createTempFile($fileData);

        $mimeType = mime_content_type($tempPath);
        $size = filesize($tempPath);

        if (!str_contains($originalName, '.')) {
            $extension = $this->getExtensionFromMimeType($mimeType);
            $originalName .= ".{$extension}";
        }

        return new UploadedFileInfo(
            originalName: $originalName,
            mimeType: $mimeType,
            size: $size,
            tempPath: $tempPath,
            metadata: ['upload_method' => 'base64']
        );
    }

    private function decodeBase64(string $base64String): string
    {
        if (str_contains($base64String, ',')) {
            $base64String = explode(',', $base64String)[1];
        }

        $decoded = base64_decode($base64String, true);

        if ($decoded === false) {
            throw new UnprocessableEntityException(
                __('files.invalid_base64'),
                'INVALID_BASE64'
            );
        }

        return $decoded;
    }

    private function createTempFile(string $content): string
    {
        $tempPath = sys_get_temp_dir() . '/' . Str::uuid() . '.tmp';
        file_put_contents($tempPath, $content);

        return $tempPath;
    }

    private function getExtensionFromMimeType(string $mimeType): string
    {
        $mimeMap = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/gif' => 'gif',
            'image/webp' => 'webp',
            'application/pdf' => 'pdf',
            'application/msword' => 'doc',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx',
            'application/vnd.ms-excel' => 'xls',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' => 'xlsx',
        ];

        return $mimeMap[$mimeType] ?? 'bin';
    }
}
