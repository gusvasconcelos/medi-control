<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Traits\HasRoles;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory;
    use HasRoles;
    use Notifiable;

    protected $table = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
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
}
