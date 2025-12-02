<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'chat_session_id',
        'role',
        'content',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    /**
     * Sessão de chat desta mensagem
     */
    public function chatSession(): BelongsTo
    {
        return $this->belongsTo(ChatSession::class);
    }
}
