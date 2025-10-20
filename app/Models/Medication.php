<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Medication extends Model
{
    protected $fillable = [
        'name',
        'active_principle',
        'manufacturer',
        'category',
        'therapeutic_class',
        'strength',
        'form',
        'description',
        'warnings',
        'interactions',
    ];

    protected $casts = [
        'interactions' => 'array',
    ];

    public function userMedications(): HasMany
    {
        return $this->hasMany(UserMedication::class);
    }
}
