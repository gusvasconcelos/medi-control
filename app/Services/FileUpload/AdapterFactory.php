<?php

namespace App\Services\FileUpload;

use App\Exceptions\UnprocessableEntityException;
use Illuminate\Http\UploadedFile;

class AdapterFactory
{
    public static function make(array $data): FileUploadAdapter
    {
        if (isset($data['url'])) {
            return new UrlAdapter();
        }

        if (isset($data['file'])) {
            if ($data['file'] instanceof UploadedFile) {
                return new MultipartAdapter();
            }

            if (is_string($data['file'])) {
                return new Base64Adapter();
            }
        }

        throw new UnprocessableEntityException(
            __('files.invalid_upload_method'),
            'INVALID_UPLOAD_METHOD'
        );
    }
}
