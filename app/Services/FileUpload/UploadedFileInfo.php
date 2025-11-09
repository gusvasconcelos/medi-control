<?php

namespace App\Services\FileUpload;

class UploadedFileInfo
{
    public function __construct(
        public readonly string $originalName,
        public readonly string $mimeType,
        public readonly int $size,
        public readonly string $tempPath,
        public readonly ?array $metadata = null
    ) {
    }
}
