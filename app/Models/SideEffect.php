<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SideEffect extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_medication_id',
        'symptom',
        'severity',
        'reported_at',
        'notes',
    ];

    protected $casts = [
        'reported_at' => 'datetime',
        'created_at' => 'datetime',
    ];

    /**
     * Medicamento do usuário relacionado
     */
    public function userMedication(): BelongsTo
    {
        return $this->belongsTo(UserMedication::class);
    }
}
