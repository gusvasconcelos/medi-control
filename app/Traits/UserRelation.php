<?php

namespace App\Traits;

use App\Models\User;
use App\Models\Scopes\UserScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait UserRelation
{
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeDisableUserScope(Builder $query): void
    {
        $query->withoutGlobalScope(UserScope::class);
    }

    protected static function booted(): void
    {
        static::addGlobalScope(new UserScope());

        static::creating(function (Model $model) {
            if (auth()->check()) {
                $model->user_id = auth()->id();
            }
        });
    }
}
