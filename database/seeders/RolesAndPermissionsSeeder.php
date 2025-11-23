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
            ['name' => 'users.view', 'display_name' => 'Visualizar Usuários', 'group' => 'Usuários do Sistema', 'description' => 'Ver lista de todos os usuários do sistema'],
            ['name' => 'users.create', 'display_name' => 'Criar Usuários', 'group' => 'Usuários do Sistema', 'description' => 'Criar novos usuários no sistema'],
            ['name' => 'users.edit', 'display_name' => 'Editar Usuários', 'group' => 'Usuários do Sistema', 'description' => 'Editar dados de usuários'],
            ['name' => 'users.delete', 'display_name' => 'Deletar Usuários', 'group' => 'Usuários do Sistema', 'description' => 'Remover usuários do sistema'],

            // Patient's Own Medications
            ['name' => 'medications.view_own', 'display_name' => 'Visualizar Próprios Medicamentos', 'group' => 'Medicamentos do Paciente', 'description' => 'Ver seus próprios medicamentos'],
            ['name' => 'medications.create_own', 'display_name' => 'Criar Próprios Medicamentos', 'group' => 'Medicamentos do Paciente', 'description' => 'Adicionar novos medicamentos para si'],
            ['name' => 'medications.edit_own', 'display_name' => 'Editar Próprios Medicamentos', 'group' => 'Medicamentos do Paciente', 'description' => 'Editar seus próprios medicamentos'],
            ['name' => 'medications.delete_own', 'display_name' => 'Deletar Próprios Medicamentos', 'group' => 'Medicamentos do Paciente', 'description' => 'Remover seus próprios medicamentos'],

            // Caregiver Permissions (for patients to grant to their caregivers)
            ['name' => 'patient.medications.view', 'display_name' => 'Ver Medicamentos do Paciente', 'group' => 'Cuidador', 'description' => 'Visualizar medicamentos do paciente sob cuidado'],
            ['name' => 'patient.medications.create', 'display_name' => 'Adicionar Medicamentos do Paciente', 'group' => 'Cuidador', 'description' => 'Adicionar medicamentos para o paciente'],
            ['name' => 'patient.medications.edit', 'display_name' => 'Editar Medicamentos do Paciente', 'group' => 'Cuidador', 'description' => 'Editar medicamentos do paciente'],
            ['name' => 'patient.medications.delete', 'display_name' => 'Deletar Medicamentos do Paciente', 'group' => 'Cuidador', 'description' => 'Remover medicamentos do paciente'],
            ['name' => 'patient.adherence.view', 'display_name' => 'Ver Adesão do Paciente', 'group' => 'Cuidador', 'description' => 'Visualizar relatórios de adesão'],
            ['name' => 'patient.adherence.mark', 'display_name' => 'Marcar Adesão do Paciente', 'group' => 'Cuidador', 'description' => 'Marcar medicamentos como tomados'],
            ['name' => 'patient.profile.view', 'display_name' => 'Ver Perfil do Paciente', 'group' => 'Cuidador', 'description' => 'Visualizar dados do paciente'],

            // Caregiver Management (for patients)
            ['name' => 'caregivers.invite', 'display_name' => 'Convidar Cuidadores', 'group' => 'Gerenciar Cuidadores', 'description' => 'Enviar convites para cuidadores'],
            ['name' => 'caregivers.remove', 'display_name' => 'Remover Cuidadores', 'group' => 'Gerenciar Cuidadores', 'description' => 'Remover acesso de cuidadores'],
            ['name' => 'caregivers.permissions', 'display_name' => 'Gerenciar Permissões dos Cuidadores', 'group' => 'Gerenciar Cuidadores', 'description' => 'Definir o que cada cuidador pode fazer'],

            // All Medications Management (Admin only)
            ['name' => 'medications.view_all', 'display_name' => 'Visualizar Todos Medicamentos', 'group' => 'Medicamentos (Admin)', 'description' => 'Ver medicamentos de todos os usuários'],
            ['name' => 'medications.manage_all', 'display_name' => 'Gerenciar Todos Medicamentos', 'group' => 'Medicamentos (Admin)', 'description' => 'Gerenciar medicamentos do sistema'],

            // Reports
            ['name' => 'reports.view_own', 'display_name' => 'Visualizar Próprios Relatórios', 'group' => 'Relatórios', 'description' => 'Ver seus próprios relatórios'],
            ['name' => 'reports.export_own', 'display_name' => 'Exportar Próprios Relatórios', 'group' => 'Relatórios', 'description' => 'Exportar seus relatórios'],
            ['name' => 'reports.view_all', 'display_name' => 'Visualizar Todos Relatórios', 'group' => 'Relatórios', 'description' => 'Ver relatórios de todos os usuários'],

            // Monitoring (Admin/Super-Admin only)
            ['name' => 'monitoring.pulse', 'display_name' => 'Acessar Pulse', 'group' => 'Monitoramento', 'description' => 'Acesso ao Laravel Pulse'],
            ['name' => 'monitoring.horizon', 'display_name' => 'Acessar Horizon', 'group' => 'Monitoramento', 'description' => 'Acesso ao Laravel Horizon'],

            // Settings
            ['name' => 'settings.view', 'display_name' => 'Visualizar Configurações', 'group' => 'Configurações', 'description' => 'Acessar configurações do sistema'],
            ['name' => 'settings.edit', 'display_name' => 'Editar Configurações', 'group' => 'Configurações', 'description' => 'Modificar configurações do sistema'],

            // Roles & Permissions (Super-Admin only)
            ['name' => 'roles.view', 'display_name' => 'Visualizar Roles', 'group' => 'Permissões do Sistema', 'description' => 'Ver roles do sistema'],
            ['name' => 'roles.create', 'display_name' => 'Criar Roles', 'group' => 'Permissões do Sistema', 'description' => 'Criar novas roles'],
            ['name' => 'roles.edit', 'display_name' => 'Editar Roles', 'group' => 'Permissões do Sistema', 'description' => 'Modificar roles existentes'],
            ['name' => 'roles.delete', 'display_name' => 'Deletar Roles', 'group' => 'Permissões do Sistema', 'description' => 'Remover roles do sistema'],
            ['name' => 'permissions.view', 'display_name' => 'Visualizar Permissões', 'group' => 'Permissões do Sistema', 'description' => 'Ver permissões do sistema'],
            ['name' => 'permissions.create', 'display_name' => 'Criar Permissões', 'group' => 'Permissões do Sistema', 'description' => 'Criar novas permissões'],
            ['name' => 'permissions.edit', 'display_name' => 'Editar Permissões', 'group' => 'Permissões do Sistema', 'description' => 'Modificar permissões existentes'],
            ['name' => 'permissions.delete', 'display_name' => 'Deletar Permissões', 'group' => 'Permissões do Sistema', 'description' => 'Remover permissões do sistema'],
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
        // Caregivers não recebem permissões por padrão
        // As permissões são gerenciadas pelo paciente através da tabela caregiver_permissions
        $this->command->info('🎉 Roles and permissions created successfully!');
        $this->command->info('');
        $this->command->info('📋 Roles criadas:');
        $this->command->info('  - super-admin: Acesso total');
        $this->command->info('  - admin: Gerenciamento do sistema');
        $this->command->info('  - patient: Gerencia próprios medicamentos e cuidadores');
        $this->command->info('  - caregiver: Acesso definido pelo paciente');
        $this->command->info('');
        $this->command->info('💡 Permissões para cuidadores são gerenciadas pelo paciente!');
    }
}
