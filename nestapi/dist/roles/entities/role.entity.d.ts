import { Permission } from './permission.entity';
export declare enum RoleType {
    ADMIN = "admin",
    MANAGER = "manager",
    USER = "user"
}
export declare class Role {
    id: number;
    name: RoleType;
    description: string;
    permissions: Permission[];
    createdAt: Date;
    updatedAt: Date;
}
