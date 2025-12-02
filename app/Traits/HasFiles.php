<?php

namespace App\Traits;

use App\Models\File;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait HasFiles
{
    public function files(): MorphMany
    {
        return $this->morphMany(File::class, 'fileable');
    }

    public function activeFiles(): MorphMany
    {
        return $this->files()->where('active', true);
    }

    public function getFilesByVisibility(string $visibility): MorphMany
    {
        return $this->files()->where('visibility', $visibility);
    }
}
