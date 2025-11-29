<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // System Users Management (Admin only)
            ['name' => 'users.view', 'display_name' => 'Visualizar Usuários', 'group' => 'system', 'description' => 'Ver lista de todos os usuários do sistema'],
            ['name' => 'users.create', 'display_name' => 'Criar Usuários', 'group' => 'system', 'description' => 'Criar novos usuários no sistema'],
            ['name' => 'users.edit', 'display_name' => 'Editar Usuários', 'group' => 'system', 'description' => 'Editar dados de usuários'],
            ['name' => 'users.delete', 'display_name' => 'Deletar Usuários', 'group' => 'system', 'description' => 'Remover usuários do sistema'],

            // Patient's Own Medications
            ['name' => 'medications.view_own', 'display_name' => 'Visualizar Próprios Medicamentos', 'group' => 'patient', 'description' => 'Ver seus próprios medicamentos'],
            ['name' => 'medications.create_own', 'display_name' => 'Criar Próprios Medicamentos', 'group' => 'patient', 'description' => 'Adicionar novos medicamentos para si'],
            ['name' => 'medications.edit_own', 'display_name' => 'Editar Próprios Medicamentos', 'group' => 'patient', 'description' => 'Editar seus próprios medicamentos'],
            ['name' => 'medications.delete_own', 'display_name' => 'Deletar Próprios Medicamentos', 'group' => 'patient', 'description' => 'Remover seus próprios medicamentos'],

            // Caregiver Permissions (for patients to grant to their caregivers)
            ['name' => 'patient.medications.view', 'display_name' => 'Ver Medicamentos do Paciente', 'group' => 'caregiver', 'description' => 'Visualizar medicamentos do paciente sob cuidado'],
            ['name' => 'patient.medications.create', 'display_name' => 'Adicionar Medicamentos do Paciente', 'group' => 'caregiver', 'description' => 'Adicionar medicamentos para o paciente'],
            ['name' => 'patient.medications.edit', 'display_name' => 'Editar Medicamentos do Paciente', 'group' => 'caregiver', 'description' => 'Editar medicamentos do paciente'],
            ['name' => 'patient.medications.delete', 'display_name' => 'Deletar Medicamentos do Paciente', 'group' => 'caregiver', 'description' => 'Remover medicamentos do paciente'],
            ['name' => 'patient.adherence.view', 'display_name' => 'Ver Adesão do Paciente', 'group' => 'caregiver', 'description' => 'Visualizar relatórios de adesão'],
            ['name' => 'patient.adherence.mark', 'display_name' => 'Marcar Adesão do Paciente', 'group' => 'caregiver', 'description' => 'Marcar medicamentos como tomados'],
            ['name' => 'patient.profile.view', 'display_name' => 'Ver Perfil do Paciente', 'group' => 'caregiver', 'description' => 'Visualizar dados do paciente'],

            // Caregiver Management (for patients)
            ['name' => 'caregivers.invite', 'display_name' => 'Convidar Cuidadores', 'group' => 'patient', 'description' => 'Enviar convites para cuidadores'],
            ['name' => 'caregivers.remove', 'display_name' => 'Remover Cuidadores', 'group' => 'patient', 'description' => 'Remover acesso de cuidadores'],
            ['name' => 'caregivers.permissions', 'display_name' => 'Gerenciar Permissões dos Cuidadores', 'group' => 'patient', 'description' => 'Definir o que cada cuidador pode fazer'],

            // All Medications Management (Admin only)
            ['name' => 'medications.view_all', 'display_name' => 'Visualizar Todos Medicamentos', 'group' => 'system', 'description' => 'Ver medicamentos de todos os usuários'],
            ['name' => 'medications.manage_all', 'display_name' => 'Gerenciar Todos Medicamentos', 'group' => 'system', 'description' => 'Gerenciar medicamentos do sistema'],

            // Reports
            ['name' => 'reports.view_own', 'display_name' => 'Visualizar Próprios Relatórios', 'group' => 'patient', 'description' => 'Ver seus próprios relatórios'],
            ['name' => 'reports.export_own', 'display_name' => 'Exportar Próprios Relatórios', 'group' => 'patient', 'description' => 'Exportar seus relatórios'],
            ['name' => 'reports.view_all', 'display_name' => 'Visualizar Todos Relatórios', 'group' => 'patient', 'description' => 'Ver relatórios de todos os usuários'],

            // Monitoring (Admin/Super-Admin only)
            ['name' => 'monitoring.pulse', 'display_name' => 'Acessar Pulse', 'group' => 'system', 'description' => 'Acesso ao Laravel Pulse'],
            ['name' => 'monitoring.horizon', 'display_name' => 'Acessar Horizon', 'group' => 'system', 'description' => 'Acesso ao Laravel Horizon'],

            // Settings
            ['name' => 'settings.view', 'display_name' => 'Visualizar Configurações', 'group' => 'system', 'description' => 'Acessar configurações do sistema'],
            ['name' => 'settings.edit', 'display_name' => 'Editar Configurações', 'group' => 'system', 'description' => 'Modificar configurações do sistema'],

            // Roles & Permissions (Super-Admin only)
            ['name' => 'roles.view', 'display_name' => 'Visualizar Roles', 'group' => 'system', 'description' => 'Ver roles do sistema'],
            ['name' => 'roles.create', 'display_name' => 'Criar Roles', 'group' => 'system', 'description' => 'Criar novas roles'],
            ['name' => 'roles.edit', 'display_name' => 'Editar Roles', 'group' => 'system', 'description' => 'Modificar roles existentes'],
            ['name' => 'roles.delete', 'display_name' => 'Deletar Roles', 'group' => 'system', 'description' => 'Remover roles do sistema'],
            ['name' => 'permissions.view', 'display_name' => 'Visualizar Permissões', 'group' => 'system', 'description' => 'Ver permissões do sistema'],
            ['name' => 'permissions.create', 'display_name' => 'Criar Permissões', 'group' => 'system', 'description' => 'Criar novas permissões'],
            ['name' => 'permissions.edit', 'display_name' => 'Editar Permissões', 'group' => 'system', 'description' => 'Modificar permissões existentes'],
            ['name' => 'permissions.delete', 'display_name' => 'Deletar Permissões', 'group' => 'system', 'description' => 'Remover permissões do sistema'],
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(
                ['name' => $permission['name'], 'guard_name' => 'web'],
                $permission
            );
        }

        // Create roles
        $superAdmin = Role::updateOrCreate(
            ['name' => 'super-admin', 'guard_name' => 'web'],
            [
                'display_name' => 'Super Administrador',
                'description' => 'Acesso total ao sistema, incluindo gerenciamento de permissões e configurações avançadas'
            ]
        );
        $superAdmin->givePermissionTo(Permission::all());

        $admin = Role::updateOrCreate(
            ['name' => 'admin', 'guard_name' => 'web'],
            [
                'display_name' => 'Administrador',
                'description' => 'Gerencia usuários do sistema, visualiza medicamentos e relatórios gerais'
            ]
        );
        $admin->givePermissionTo([
            'users.view', 'users.create', 'users.edit', 'users.delete',
            'medications.view_all', 'medications.manage_all',
            'reports.view_all',
            'monitoring.pulse', 'monitoring.horizon',
        ]);

        $patient = Role::updateOrCreate(
            ['name' => 'patient', 'guard_name' => 'web'],
            [
                'display_name' => 'Paciente',
                'description' => 'Usuário paciente que gerencia seus próprios medicamentos e cuidadores'
            ]
        );
        $patient->givePermissionTo([
            // Manage own medications
            'medications.view_own',
            'medications.create_own',
            'medications.edit_own',
            'medications.delete_own',

            // Manage caregivers
            'caregivers.invite',
            'caregivers.remove',
            'caregivers.permissions',

            // Own reports
            'reports.view_own',
            'reports.export_own',
        ]);

        $caregiver = Role::updateOrCreate(
            ['name' => 'caregiver', 'guard_name' => 'web'],
            [
                'display_name' => 'Cuidador',
                'description' => 'Cuidador que pode gerenciar medicamentos de pacientes específicos conforme permissões concedidas'
            ]
        );

        $this->command->info('🎉 Roles and permissions created successfully!');
        $this->command->info('');
        $this->command->info('📋 Roles created:');
        $this->command->info('  - super-admin: Full access');
        $this->command->info('  - admin: System management');
        $this->command->info('  - patient: Manage own medications and caregivers');
        $this->command->info('  - caregiver: Access defined by the patient');
        $this->command->info('');
        $this->command->info('💡 Caregiver permissions are managed by the patient!');
    }
}
