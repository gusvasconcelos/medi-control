<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MedicationInteraction extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'owner_id',
        'related_id',
        'severity',
        'description',
        'recommendation',
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(Medication::class, 'owner_id');
    }

    public function related(): BelongsTo
    {
        return $this->belongsTo(Medication::class, 'related_id');
    }
}
