<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileStorageService
{
    public static function put(
        string $tempPath,
        int $uploadedBy,
        string $fileableType,
        string $originalName,
        string $disk = 's3'
    ): array {
        $extension = pathinfo($originalName, PATHINFO_EXTENSION);

        $storedName = Str::uuid() . '.' . $extension;

        $path = self::generatePath($uploadedBy, $fileableType, $storedName);

        $content = file_get_contents($tempPath);

        Storage::disk($disk)->put($path, $content);

        return [
            'stored_name' => $storedName,
            'path' => $path,
        ];
    }

    public static function delete(string $path, string $disk = 's3'): bool
    {
        return Storage::disk($disk)->delete($path);
    }

    public static function generateTemporaryUrl(string $path, string $disk = 's3', int $expiresInMinutes = 60): string
    {
        return Storage::disk($disk)->temporaryUrl( // @phpstan-ignore-line
            $path,
            now()->addMinutes($expiresInMinutes)
        );
    }

    private static function generatePath(int $uploadedBy, string $fileableType, string $storedName): string
    {
        $sanitizedType = Str::slug(class_basename($fileableType));

        return "{$uploadedBy}/{$sanitizedType}/{$storedName}";
    }
}
