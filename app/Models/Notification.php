<?php

namespace App\Models;

use App\Enums\NotificationStatus;
use App\Traits\UserRelation;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    use HasFactory;
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
        'status' => NotificationStatus::class,
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function userMedication(): BelongsTo
    {
        return $this->belongsTo(UserMedication::class);
    }
}
