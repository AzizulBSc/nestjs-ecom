import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
export declare class RolesService {
    private rolesRepository;
    private permissionsRepository;
    constructor(rolesRepository: Repository<Role>, permissionsRepository: Repository<Permission>);
    findAll(): Promise<Role[]>;
    findOne(id: number): Promise<Role | null>;
    findAllPermissions(): Promise<Permission[]>;
}
