<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class File extends Model
{
    use HasFactory;

    protected $fillable = [
        'uploaded_by',
        'fileable_type',
        'fileable_id',
        'original_name',
        'stored_name',
        'path',
        'disk',
        'mime_type',
        'size',
        'visibility',
        'metadata',
        'active',
    ];

    protected $casts = [
        'metadata' => 'array',
        'size' => 'integer',
        'active' => 'boolean',
    ];

    protected $searchable = [
        'original_name',
        'mime_type',
    ];

    public function fileable(): MorphTo
    {
        return $this->morphTo();
    }

    public function uploadedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function scopeByVisibility(Builder $query, string $visibility): Builder
    {
        return $query->where('visibility', $visibility);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('active', true);
    }

    public function scopeByAuthenticatedUser(Builder $query): Builder
    {
        return $query->where('uploaded_by', auth()->id());
    }

    public function scopeByFileable(Builder $query, Model $fileable): Builder
    {
        return $query->where('fileable_type', get_class($fileable))->where('fileable_id', $fileable->id);
    }
}
