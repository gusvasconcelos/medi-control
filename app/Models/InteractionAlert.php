<?php

namespace App\Models;

use App\Traits\UserRelation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InteractionAlert extends Model
{
    use UserRelation;

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'medication_1_id',
        'medication_2_id',
        'severity',
        'description',
        'recommendation',
        'detected_at',
        'acknowledged_at',
    ];

    protected $casts = [
        'detected_at' => 'datetime',
        'acknowledged_at' => 'datetime',
        'created_at' => 'datetime',
    ];

    /**
     * Usuário que recebeu o alerta
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Primeiro medicamento da interação
     */
    public function medication1(): BelongsTo
    {
        return $this->belongsTo(Medication::class, 'medication_1_id');
    }

    /**
     * Segundo medicamento da interação
     */
    public function medication2(): BelongsTo
    {
        return $this->belongsTo(Medication::class, 'medication_2_id');
    }
}
