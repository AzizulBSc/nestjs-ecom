import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
        role: import("../roles/entities/role.entity").Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
