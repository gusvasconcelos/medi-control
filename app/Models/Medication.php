<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Medication extends Model
{
    use HasFactory;

    protected $searchable = ['name'];

    protected $fillable = [
        'name',
        'active_principle',
        'manufacturer',
        'category',
        'therapeutic_class',
        'registration_number',
        'strength',
        'form',
        'description',
    ];

    public function userMedications(): HasMany
    {
        return $this->hasMany(UserMedication::class);
    }

    public function interactions(): HasMany
    {
        return $this->hasMany(MedicationInteraction::class);
    }
}
