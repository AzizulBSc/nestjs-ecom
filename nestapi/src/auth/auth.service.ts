import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, RoleType } from '../roles/entities/role.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await user.validatePassword(password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role.name,
      permissions: user.role.permissions?.map((p) => p.name) || [],
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role.name,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    // Find default user role
    const userRole = await this.rolesRepository.findOne({
      where: { name: RoleType.USER },
    });

    const user = await this.usersService.create({
      ...registerDto,
      roleId: userRole?.id,
    });

    const { password, ...result } = user;
    return result;
  }

  async validateToken(payload: any) {
    return this.usersService.findByEmail(payload.email);
  }
}
