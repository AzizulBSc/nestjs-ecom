import { Role } from '../../roles/entities/role.entity';
export declare class User {
    id: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    isActive: boolean;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
    hashPassword(): Promise<void>;
    validatePassword(password: string): Promise<boolean>;
}
