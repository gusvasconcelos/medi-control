<?php

namespace App\Models;

use App\Traits\UserRelation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdherenceReport extends Model
{
    use UserRelation;

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'period_start',
        'period_end',
        'total_scheduled',
        'total_taken',
        'adherence_rate',
        'generated_at',
        'file_path',
    ];

    protected $casts = [
        'period_start' => 'date',
        'period_end' => 'date',
        'adherence_rate' => 'decimal:2',
        'generated_at' => 'datetime',
        'created_at' => 'datetime',
    ];

    /**
     * Usuário dono do relatório
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
