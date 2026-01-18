"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const typeorm_1 = require("typeorm");
const role_entity_1 = require("./roles/entities/role.entity");
const permission_entity_1 = require("./roles/entities/permission.entity");
const user_entity_1 = require("./users/entities/user.entity");
const bcrypt = __importStar(require("bcrypt"));
async function seedDatabase() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const dataSource = app.get(typeorm_1.DataSource);
    try {
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
        const permissionsRepo = dataSource.getRepository(permission_entity_1.Permission);
        const permissions = [];
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
        const rolesRepo = dataSource.getRepository(role_entity_1.Role);
        let adminRole = await rolesRepo.findOne({
            where: { name: role_entity_1.RoleType.ADMIN },
        });
        if (!adminRole) {
            adminRole = rolesRepo.create({
                name: role_entity_1.RoleType.ADMIN,
                description: 'Administrator with full access',
                permissions: permissions,
            });
            await rolesRepo.save(adminRole);
        }
        let managerRole = await rolesRepo.findOne({
            where: { name: role_entity_1.RoleType.MANAGER },
        });
        if (!managerRole) {
            managerRole = rolesRepo.create({
                name: role_entity_1.RoleType.MANAGER,
                description: 'Manager with limited access',
                permissions: permissions.filter((p) => p.name.includes('read') ||
                    p.name.includes('update') ||
                    p.name.includes('products') ||
                    p.name.includes('orders')),
            });
            await rolesRepo.save(managerRole);
        }
        let userRole = await rolesRepo.findOne({ where: { name: role_entity_1.RoleType.USER } });
        if (!userRole) {
            userRole = rolesRepo.create({
                name: role_entity_1.RoleType.USER,
                description: 'Regular user with basic access',
                permissions: permissions.filter((p) => p.name === 'products.read' ||
                    p.name === 'orders.create' ||
                    p.name === 'orders.read'),
            });
            await rolesRepo.save(userRole);
        }
        console.log('✅ Roles created');
        const usersRepo = dataSource.getRepository(user_entity_1.User);
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
            await usersRepo.save(adminUser, { listeners: false });
            console.log('✅ Admin user created (email: admin@example.com, password: admin123456)');
        }
        else {
            console.log('ℹ️  Admin user already exists');
        }
        console.log('\n🎉 Database seeding completed successfully!');
    }
    catch (error) {
        console.error('❌ Error seeding database:', error);
    }
    finally {
        await app.close();
    }
}
seedDatabase();
//# sourceMappingURL=seed.js.map