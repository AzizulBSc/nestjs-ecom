import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Repository } from 'typeorm';
import { Role } from '../roles/entities/role.entity';
export declare class AuthService {
    private usersService;
    private jwtService;
    private rolesRepository;
    constructor(usersService: UsersService, jwtService: JwtService, rolesRepository: Repository<Role>);
    validateUser(email: string, password: string): Promise<any>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            role: any;
        };
    }>;
    register(registerDto: RegisterDto): Promise<{
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        isActive: boolean;
        role: Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    validateToken(payload: any): Promise<import("../users/entities/user.entity").User | null>;
}
