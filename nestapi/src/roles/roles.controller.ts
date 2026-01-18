import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleType } from './entities/role.entity';

@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Roles(RoleType.ADMIN)
  findAll() {
    return this.rolesService.findAll();
  }

  @Get('permissions')
  @Roles(RoleType.ADMIN)
  findAllPermissions() {
    return this.rolesService.findAllPermissions();
  }
}
