export interface Permission {
    id: number;
    name: string;
    display_name: string;
    description?: string;
    group?: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
}

export interface Role {
    id: number;
    name: string;
    display_name: string;
    description?: string;
    guard_name: string;
    permissions?: Permission[];
    permissions_count?: number;
    created_at: string;
    updated_at: string;
}

export interface PermissionGroup {
    group: string;
    permissions: Permission[];
}

