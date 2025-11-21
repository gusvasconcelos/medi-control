<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $guards = ['api', 'web'];
        $roles = ['super-admin', 'patient', 'caregiver'];

        foreach ($guards as $guard) {
            foreach ($roles as $role) {
                Role::firstOrCreate(['name' => $role, 'guard_name' => $guard]);
            }
        }
    }
}
