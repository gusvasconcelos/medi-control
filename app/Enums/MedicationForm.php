<?php

namespace App\Enums;

enum MedicationForm: string
{
    case TABLET = 'tablet';
    case CAPSULE = 'capsule';
    case LIQUID = 'liquid';
    case INJECTION = 'injection';
    case CREAM = 'cream';
    case DROPS = 'drops';
    case SPRAY = 'spray';
    case INHALER = 'inhaler';
    case PATCH = 'patch';
    case OTHER = 'other';

    public function label(): string
    {
        return match ($this) {
            self::TABLET => 'Tablet',
            self::CAPSULE => 'Capsule',
            self::LIQUID => 'Liquid',
            self::INJECTION => 'Injection',
            self::CREAM => 'Cream',
            self::DROPS => 'Drops',
            self::SPRAY => 'Spray',
            self::INHALER => 'Inhaler',
            self::PATCH => 'Patch',
            self::OTHER => 'Other',
        };
    }

    public function value(): string
    {
        return match ($this) {
            self::TABLET => 'tablet',
            self::CAPSULE => 'capsule',
            self::LIQUID => 'liquid',
            self::INJECTION => 'injection',
            self::CREAM => 'cream',
            self::DROPS => 'drops',
            self::SPRAY => 'spray',
            self::INHALER => 'inhaler',
            self::PATCH => 'patch',
            self::OTHER => 'other',
        };
    }
}
