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
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Attributes\Scope;

class User extends Authenticatable
{
    use HasFactory;
    use HasRoles;
    use HasFiles;
    use HasApiTokens;
    use Notifiable;

    protected $table = 'users';

    protected $searchable = [
        'name',
        'email',
        'phone',
    ];

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'onesignal_player_id',
        'profile_photo_path',
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

    /**
     * Get the profile photo URL attribute.
     */
    public function getProfilePhotoUrlAttribute(): ?string
    {
        if (! $this->profile_photo_path) {
            return null;
        }

        // Check if it's already a full URL
        if (str_starts_with($this->profile_photo_path, 'http://') ||
            str_starts_with($this->profile_photo_path, 'https://')) {
            return $this->profile_photo_path;
        }

        // Determine the disk from files table or default to 's3'
        /** @var \App\Models\File|null $file */
        $file = $this->files()->where('path', $this->profile_photo_path)->first();
        $disk = $file ? $file->disk : 's3';

        // Try to generate URL based on disk type
        try {
            if ($disk === 's3') {
                return \App\Services\FileStorageService::generateTemporaryUrl(
                    $this->profile_photo_path,
                    's3',
                    60 * 24 * 7 // 7 days
                );
            }

            // For local/public disk, use storage URL
            return \Illuminate\Support\Facades\Storage::disk($disk)->url($this->profile_photo_path);
        } catch (\Exception $e) {
            // Fallback to public storage URL
            return url('/storage/' . $this->profile_photo_path);
        }
    }

    /**
     * Append profile_photo_url to array/JSON serialization.
     */
    protected $appends = ['profile_photo_url'];

    public function medications(): HasMany
    {
        return $this->hasMany(UserMedication::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    public function chatSession(): HasOne
    {
        return $this->hasOne(ChatSession::class);
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

    public function devices(): HasMany
    {
        return $this->hasMany(UserDevice::class);
    }

    public function activeDevices(): HasMany
    {
        return $this->hasMany(UserDevice::class)->where('active', true);
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

    #[Scope]
    public function whereFullText(Builder $query, string $field, ?string $value): Builder
    {
        if (is_null($value) || trim($value) === '') {
            return $query;
        }

        $unaccented = cast()->unaccent($value);

        return $query->orWhereRaw("UNACCENT({$field})::text ILIKE ?", ["%{$unaccented}%"]);
    }

    #[Scope]
    public function search(Builder $query, ?string $value): Builder
    {
        if (is_null($value) || trim($value) === '') {
            return $query;
        }

        $searchable = $this->searchable ?: $this->getFillable();

        $query->where(function (Builder $q) use ($searchable, $value) {
            foreach ($searchable as $field) {
                $q->whereFullText($field, $value);
            }
        });

        return $query;
    }
}
