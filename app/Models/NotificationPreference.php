<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotificationPreference extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'medication_reminder',
        'low_stock_alert',
        'interaction_alert',
        'push_enabled',
        'whatsapp_enabled',
        'quiet_hours_start',
        'quiet_hours_end',
    ];

    protected $casts = [
        'medication_reminder' => 'boolean',
        'low_stock_alert' => 'boolean',
        'interaction_alert' => 'boolean',
        'push_enabled' => 'boolean',
        'whatsapp_enabled' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
