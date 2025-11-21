<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Traits\HasFiles;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Notifications\Notifiable;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Authenticatable
{
    use HasFactory;
    use HasRoles;
    use HasFiles;
    use HasApiTokens;
    use Notifiable;

    protected $table = 'users';

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function medications(): HasMany
    {
        return $this->hasMany(UserMedication::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    public function chatSessions(): HasMany
    {
        return $this->hasMany(ChatSession::class);
    }

    public function adherenceReports(): HasMany
    {
        return $this->hasMany(AdherenceReport::class);
    }

    public function interactionAlerts(): HasMany
    {
        return $this->hasMany(InteractionAlert::class);
    }

    public function notificationPreferences(): HasOne
    {
        return $this->hasOne(NotificationPreference::class);
    }

    public function patientsUnderCare(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'caregiver_patient', 'caregiver_id', 'patient_id')
            ->wherePivot('status', 'active')
            ->withPivot(['id', 'status', 'invited_at', 'accepted_at'])
            ->withTimestamps();
    }

    public function caregivers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'caregiver_patient', 'patient_id', 'caregiver_id')
            ->wherePivot('status', 'active')
            ->withPivot(['id', 'status', 'invited_at', 'accepted_at'])
            ->withTimestamps();
    }

    public function caregiverHasPermissionFor(int $patientId, string $permission): bool
    {
        return DB::table('caregiver_patient as cp')
            ->join('caregiver_permissions as cper', 'cp.id', '=', 'cper.caregiver_patient_id')
            ->join('permissions as p', 'cper.permission_id', '=', 'p.id')
            ->where('cp.caregiver_id', $this->id)
            ->where('cp.patient_id', $patientId)
            ->where('cp.status', 'active')
            ->where('p.name', $permission)
            ->exists();
    }

    public function sendPasswordResetNotification(#[\SensitiveParameter] $token)
    {
        $this->notify(new ResetPasswordNotification($token));
    }
}
