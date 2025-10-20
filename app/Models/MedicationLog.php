<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MedicationLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_medication_id',
        'scheduled_at',
        'taken_at',
        'status',
        'notes',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'taken_at' => 'datetime',
        'created_at' => 'datetime',
    ];

    public function userMedication(): BelongsTo
    {
        return $this->belongsTo(UserMedication::class);
    }
}
