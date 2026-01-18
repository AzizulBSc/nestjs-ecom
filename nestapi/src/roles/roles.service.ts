import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}

  async findAll(): Promise<Role[]> {
    return this.rolesRepository.find({ relations: ['permissions'] });
  }

  async findOne(id: number): Promise<Role | null> {
    return this.rolesRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
  }

  async findAllPermissions(): Promise<Permission[]> {
    return this.permissionsRepository.find();
  }
}
