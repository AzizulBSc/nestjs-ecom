import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../roles/entities/role.entity';
export declare class UsersService {
    private usersRepository;
    private rolesRepository;
    constructor(usersRepository: Repository<User>, rolesRepository: Repository<Role>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(page?: number, limit?: number, search?: string): Promise<{
        data: User[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: number): Promise<void>;
}
