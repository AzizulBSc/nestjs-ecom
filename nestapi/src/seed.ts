import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Role, RoleType } from './roles/entities/role.entity';
import { Permission } from './roles/entities/permission.entity';
import { User } from './users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

async function seedDatabase() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    // Create Permissions
    const permissionsData = [
      { name: 'users.create', description: 'Create users', module: 'users' },
      { name: 'users.read', description: 'Read users', module: 'users' },
      { name: 'users.update', description: 'Update users', module: 'users' },
      { name: 'users.delete', description: 'Delete users', module: 'users' },
      {
        name: 'products.create',
        description: 'Create products',
        module: 'products',
      },
      {
        name: 'products.read',
        description: 'Read products',
        module: 'products',
      },
      {
        name: 'products.update',
        description: 'Update products',
        module: 'products',
      },
      {
        name: 'products.delete',
        description: 'Delete products',
        module: 'products',
      },
      { name: 'orders.create', description: 'Create orders', module: 'orders' },
      { name: 'orders.read', description: 'Read orders', module: 'orders' },
      { name: 'orders.update', description: 'Update orders', module: 'orders' },
      { name: 'orders.delete', description: 'Delete orders', module: 'orders' },
    ];

    const permissionsRepo = dataSource.getRepository(Permission);
    const permissions: Permission[] = [];

    for (const permData of permissionsData) {
      let permission = await permissionsRepo.findOne({
        where: { name: permData.name },
      });
      if (!permission) {
        permission = permissionsRepo.create(permData);
        await permissionsRepo.save(permission);
      }
      permissions.push(permission);
    }

    console.log('✅ Permissions created');

    // Create Roles
    const rolesRepo = dataSource.getRepository(Role);

    // Admin role with all permissions
    let adminRole = await rolesRepo.findOne({
      where: { name: RoleType.ADMIN },
    });
    if (!adminRole) {
      adminRole = rolesRepo.create({
        name: RoleType.ADMIN,
        description: 'Administrator with full access',
        permissions: permissions,
      });
      await rolesRepo.save(adminRole);
    }

    // Manager role with limited permissions
    let managerRole = await rolesRepo.findOne({
      where: { name: RoleType.MANAGER },
    });
    if (!managerRole) {
      managerRole = rolesRepo.create({
        name: RoleType.MANAGER,
        description: 'Manager with limited access',
        permissions: permissions.filter(
          (p) =>
            p.name.includes('read') ||
            p.name.includes('update') ||
            p.name.includes('products') ||
            p.name.includes('orders'),
        ),
      });
      await rolesRepo.save(managerRole);
    }

    // User role with basic permissions
    let userRole = await rolesRepo.findOne({ where: { name: RoleType.USER } });
    if (!userRole) {
      userRole = rolesRepo.create({
        name: RoleType.USER,
        description: 'Regular user with basic access',
        permissions: permissions.filter(
          (p) =>
            p.name === 'products.read' ||
            p.name === 'orders.create' ||
            p.name === 'orders.read',
        ),
      });
      await rolesRepo.save(userRole);
    }

    console.log('✅ Roles created');

    // Create Admin User
    const usersRepo = dataSource.getRepository(User);
    let adminUser = await usersRepo.findOne({
      where: { email: 'admin@example.com' },
    });

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin123456', 10);
      adminUser = usersRepo.create({
        email: 'admin@example.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        phone: '+1234567890',
        isActive: true,
        role: adminRole,
      });
      // Use { listeners: false } to skip BeforeInsert hook since password is already hashed
      await usersRepo.save(adminUser, { listeners: false });
      console.log(
        '✅ Admin user created (email: admin@example.com, password: admin123456)',
      );
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Seed 5000 Users
    console.log('⏳ Seeding 5000 users...');
    const usersToCreate = 5000;
    const batchSize = 500; // Save in batches of 500
    const defaultPassword = await bcrypt.hash('password123', 10); // Hash once for performance

    let usersBatch: User[] = [];

    for (let i = 0; i < usersToCreate; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = faker.internet.email({ firstName, lastName });

      const user = usersRepo.create({
        email: email,
        password: defaultPassword,
        firstName: firstName,
        lastName: lastName,
        phone: faker.phone.number(),
        isActive: true,
        role: userRole,
      });

      usersBatch.push(user);

      if (usersBatch.length >= batchSize) {
        await usersRepo.save(usersBatch, { listeners: false });
        console.log(
          `✅ Saved batch of ${batchSize} users (${i + 1}/${usersToCreate})`,
        );
        usersBatch = [];
      }
    }

    // Save remaining users
    if (usersBatch.length > 0) {
      await usersRepo.save(usersBatch, { listeners: false });
      console.log(`✅ Saved final batch of ${usersBatch.length} users`);
    }

    console.log('\n🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await app.close();
  }
}

seedDatabase();
