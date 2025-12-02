<?php

namespace App\Services\FileUpload;

use App\Exceptions\UnprocessableEntityException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class UrlAdapter implements FileUploadAdapter
{
    private const MAX_FILE_SIZE = 10 * 1024 * 1024;

    public function upload(array $data): UploadedFileInfo
    {
        $url = $data['url'] ?? null;

        if (!$url || !filter_var($url, FILTER_VALIDATE_URL)) {
            throw new UnprocessableEntityException(
                __('files.invalid_url'),
                'INVALID_URL'
            );
        }

        $response = Http::timeout(30)->get($url);

        if (!$response->successful()) {
            throw new UnprocessableEntityException(
                __('files.url_download_failed'),
                'URL_DOWNLOAD_FAILED'
            );
        }

        $content = $response->body();
        $size = strlen($content);

        if ($size > self::MAX_FILE_SIZE) {
            throw new UnprocessableEntityException(
                __('files.file_too_large'),
                'FILE_TOO_LARGE'
            );
        }

        $tempPath = $this->createTempFile($content);
        $mimeType = $response->header('Content-Type') ?? mime_content_type($tempPath);
        $originalName = $this->extractFilenameFromUrl($url);

        return new UploadedFileInfo(
            originalName: $originalName,
            mimeType: $mimeType,
            size: $size,
            tempPath: $tempPath,
            metadata: [
                'upload_method' => 'url',
                'source_url' => $url,
            ]
        );
    }

    private function createTempFile(string $content): string
    {
        $tempPath = sys_get_temp_dir() . '/' . Str::uuid() . '.tmp';
        file_put_contents($tempPath, $content);

        return $tempPath;
    }

    private function extractFilenameFromUrl(string $url): string
    {
        $path = parse_url($url, PHP_URL_PATH);
        $filename = basename($path);

        if (!$filename || $filename === '' || !str_contains($filename, '.')) {
            return 'downloaded_file';
        }

        return $filename;
    }
}
