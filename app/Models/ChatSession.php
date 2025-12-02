<?php

namespace App\Models;

use App\Traits\UserRelation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ChatSession extends Model
{
    use UserRelation;

    protected $fillable = [
        'user_id',
        'title',
        'started_at',
        'last_message_at',
        'expires_at',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'last_message_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(ChatMessage::class)->orderBy('created_at', 'asc');
    }

    public static function getOrCreateForUser(User $user): ChatSession
    {
        return self::firstOrCreate(
            ['user_id' => $user->id],
            [
                'started_at' => now(),
                'expires_at' => now()->addHours(24),
            ]
        );
    }

    public function updateLastMessageTimestamp(): void
    {
        $this->update([
            'last_message_at' => now(),
            'expires_at' => now()->addHours(24),
        ]);
    }
}
