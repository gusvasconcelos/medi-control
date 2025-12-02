<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserDevice extends Model
{
    protected $fillable = [
        'user_id',
        'onesignal_player_id',
        'device_type',
        'browser',
        'os',
        'device_name',
        'last_seen_at',
        'active',
    ];

    protected function casts(): array
    {
        return [
            'last_seen_at' => 'datetime',
            'active' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function markAsSeen(): void
    {
        $this->update(['last_seen_at' => now()]);
    }

    public function deactivate(): void
    {
        $this->update(['active' => false]);
    }

    public function activate(): void
    {
        $this->update(['active' => true]);
    }
}
