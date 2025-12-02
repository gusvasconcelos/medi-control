<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Collection;

class CaregiverPatient extends Model
{
    public const STATUS_PENDING = 'pending';

    public const STATUS_ACTIVE = 'active';

    public const STATUS_REVOKED = 'revoked';

    protected $table = 'caregiver_patient';

    protected $fillable = [
        'caregiver_id',
        'patient_id',
        'status',
        'invited_at',
        'accepted_at',
        'revoked_at',
    ];

    protected function casts(): array
    {
        return [
            'invited_at' => 'datetime',
            'accepted_at' => 'datetime',
            'revoked_at' => 'datetime',
        ];
    }

    public function caregiver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'caregiver_id');
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(
            \Spatie\Permission\Models\Permission::class,
            'caregiver_permissions',
            'caregiver_patient_id',
            'permission_id'
        );
    }

    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    public function isRevoked(): bool
    {
        return $this->status === self::STATUS_REVOKED;
    }

    public function accept(): void
    {
        $this->update([
            'status' => self::STATUS_ACTIVE,
            'accepted_at' => now(),
        ]);
    }

    public function revoke(): void
    {
        $this->update([
            'status' => self::STATUS_REVOKED,
            'revoked_at' => now(),
        ]);
    }

    /**
     * @param array<int> $permissionIds
     */
    public function syncCaregiverPermissions(array $permissionIds): void
    {
        $this->permissions()->sync($permissionIds);
    }

    /**
     * @return Collection<int, int>
     */
    public function getPermissionIds(): Collection
    {
        return $this->permissions()->pluck('permissions.id');
    }

    /**
     * @param Builder<CaregiverPatient> $query
     * @return Builder<CaregiverPatient>
     */
    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    /**
     * @param Builder<CaregiverPatient> $query
     * @return Builder<CaregiverPatient>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_ACTIVE);
    }

    /**
     * @param Builder<CaregiverPatient> $query
     * @return Builder<CaregiverPatient>
     */
    public function scopeForPatient(Builder $query, int $patientId): Builder
    {
        return $query->where('patient_id', $patientId);
    }

    /**
     * @param Builder<CaregiverPatient> $query
     * @return Builder<CaregiverPatient>
     */
    public function scopeForCaregiver(Builder $query, int $caregiverId): Builder
    {
        return $query->where('caregiver_id', $caregiverId);
    }
}
