<?php

namespace App\Models;

use App\Traits\UserRelation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    use UserRelation;

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'user_medication_id',
        'type',
        'title',
        'body',
        'scheduled_for',
        'sent_at',
        'read_at',
        'provider',
        'status',
        'metadata',
    ];

    protected $casts = [
        'scheduled_for' => 'datetime',
        'sent_at' => 'datetime',
        'read_at' => 'datetime',
        'created_at' => 'datetime',
        'metadata' => 'array',
    ];

    /**
     * Usuário que receberá a notificação
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Medicamento relacionado (opcional)
     */
    public function userMedication(): BelongsTo
    {
        return $this->belongsTo(UserMedication::class);
    }
}
