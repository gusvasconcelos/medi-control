<?php

namespace App\Models;

use App\Traits\UserRelation;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property-read Medication|null $medication
 * @property-read User $user
 */
class UserMedication extends Model
{
    use HasFactory;
    use UserRelation;

    protected $fillable = [
        'user_id',
        'medication_id',
        'dosage',
        'time_slots',
        'via_administration',
        'start_date',
        'end_date',
        'initial_stock',
        'current_stock',
        'low_stock_threshold',
        'notes',
        'active',
    ];

    protected $casts = [
        'time_slots' => 'array',
        'start_date' => 'date',
        'end_date' => 'date',
        'active' => 'boolean',
    ];

    public function medication(): BelongsTo
    {
        return $this->belongsTo(Medication::class);
    }

    public function logs(): HasMany
    {
        return $this->hasMany(MedicationLog::class);
    }
}
