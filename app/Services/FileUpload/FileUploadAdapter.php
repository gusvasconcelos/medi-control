<?php

namespace App\Services\FileUpload;

interface FileUploadAdapter
{
    public function upload(array $data): UploadedFileInfo;
}
