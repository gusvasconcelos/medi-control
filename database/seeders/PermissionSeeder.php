<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            'view_patient_medications',
            'view_patient_logs',
            'view_patient_side_effects',
            'view_patient_reports',
            'view_patient_interactions',

            'manage_patient_medications',
            'manage_patient_logs',
            'manage_patient_stock',
            'manage_patient_side_effects',

            'receive_patient_alerts',

            'export_patient_reports',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission, 'guard_name' => 'api']
            );
        }
    }
}
