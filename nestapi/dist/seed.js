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
const category_entity_1 = require("./categories/entities/category.entity");
const product_entity_1 = require("./products/entities/product.entity");
const order_entity_1 = require("./orders/entities/order.entity");
const order_item_entity_1 = require("./orders/entities/order-item.entity");
const bcrypt = __importStar(require("bcrypt"));
const faker_1 = require("@faker-js/faker");
async function seedDatabase() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const dataSource = app.get(typeorm_1.DataSource);
    try {
        console.log('🗑️  Clearing existing data...\n');
        await dataSource.query('SET FOREIGN_KEY_CHECKS = 0');
        await dataSource.getRepository('OrderItem').clear();
        await dataSource.getRepository('Order').clear();
        await dataSource.getRepository('Product').clear();
        await dataSource.getRepository('Category').clear();
        await dataSource.getRepository('User').clear();
        await dataSource.query('DELETE FROM `role_permissions`');
        await dataSource.getRepository('Role').clear();
        await dataSource.getRepository('Permission').clear();
        await dataSource.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('✅ All existing data cleared\n');
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
            const permission = permissionsRepo.create(permData);
            await permissionsRepo.save(permission);
            permissions.push(permission);
        }
        console.log('✅ Permissions created');
        const rolesRepo = dataSource.getRepository(role_entity_1.Role);
        const adminRole = rolesRepo.create({
            name: role_entity_1.RoleType.ADMIN,
            description: 'Administrator with full access',
            permissions: permissions,
        });
        await rolesRepo.save(adminRole);
        const managerRole = rolesRepo.create({
            name: role_entity_1.RoleType.MANAGER,
            description: 'Manager with limited access',
            permissions: permissions.filter((p) => p.name.includes('read') ||
                p.name.includes('update') ||
                p.name.includes('products') ||
                p.name.includes('orders')),
        });
        await rolesRepo.save(managerRole);
        const userRole = rolesRepo.create({
            name: role_entity_1.RoleType.USER,
            description: 'Regular user with basic access',
            permissions: permissions.filter((p) => p.name === 'products.read' ||
                p.name === 'orders.create' ||
                p.name === 'orders.read'),
        });
        await rolesRepo.save(userRole);
        console.log('✅ Roles created');
        const usersRepo = dataSource.getRepository(user_entity_1.User);
        const hashedPassword = await bcrypt.hash('admin123456', 10);
        const adminUser = usersRepo.create({
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
        console.log('⏳ Seeding 5000 users...');
        const usersToCreate = 5000;
        const batchSize = 500;
        const defaultPassword = await bcrypt.hash('password123', 10);
        let usersBatch = [];
        for (let i = 0; i < usersToCreate; i++) {
            const firstName = faker_1.faker.person.firstName();
            const lastName = faker_1.faker.person.lastName();
            const email = faker_1.faker.internet.email({ firstName, lastName });
            const user = usersRepo.create({
                email: email,
                password: defaultPassword,
                firstName: firstName,
                lastName: lastName,
                phone: faker_1.faker.phone.number(),
                isActive: true,
                role: userRole,
            });
            usersBatch.push(user);
            if (usersBatch.length >= batchSize) {
                await usersRepo.save(usersBatch, { listeners: false });
                console.log(`✅ Saved batch of ${batchSize} users (${i + 1}/${usersToCreate})`);
                usersBatch = [];
            }
        }
        if (usersBatch.length > 0) {
            await usersRepo.save(usersBatch, { listeners: false });
            console.log(`✅ Saved final batch of ${usersBatch.length} users`);
        }
        console.log('\n⏳ Seeding categories...');
        const categoriesRepo = dataSource.getRepository(category_entity_1.Category);
        const categoryNames = [
            'Electronics',
            'Clothing',
            'Books',
            'Home & Kitchen',
            'Sports & Outdoors',
            'Toys & Games',
            'Beauty & Personal Care',
            'Automotive',
            'Health & Wellness',
            'Jewelry & Accessories',
            'Food & Beverages',
            'Pet Supplies',
            'Office Products',
            'Garden & Outdoor',
            'Musical Instruments',
        ];
        const categories = [];
        for (const catName of categoryNames) {
            const category = categoriesRepo.create({
                name: catName,
                description: faker_1.faker.commerce.productDescription(),
                image: faker_1.faker.image.url(),
                isActive: true,
            });
            await categoriesRepo.save(category);
            categories.push(category);
        }
        console.log(`✅ Created ${categories.length} categories`);
        console.log('\n⏳ Seeding 1000 products...');
        const productsRepo = dataSource.getRepository(product_entity_1.Product);
        const productsToCreate = 1000;
        const productBatchSize = 200;
        let productsBatch = [];
        for (let i = 0; i < productsToCreate; i++) {
            const randomCategory = categories[Math.floor(Math.random() * categories.length)];
            const product = productsRepo.create({
                name: faker_1.faker.commerce.productName(),
                description: faker_1.faker.commerce.productDescription(),
                price: parseFloat(faker_1.faker.commerce.price({ min: 10, max: 1000 })),
                stock: faker_1.faker.number.int({ min: 0, max: 500 }),
                image: faker_1.faker.image.url(),
                sku: faker_1.faker.string.alphanumeric(10).toUpperCase(),
                category: randomCategory,
                isActive: true,
            });
            productsBatch.push(product);
            if (productsBatch.length >= productBatchSize) {
                await productsRepo.save(productsBatch);
                console.log(`✅ Saved batch of ${productBatchSize} products (${i + 1}/${productsToCreate})`);
                productsBatch = [];
            }
        }
        if (productsBatch.length > 0) {
            await productsRepo.save(productsBatch);
            console.log(`✅ Saved final batch of ${productsBatch.length} products`);
        }
        const allProducts = await productsRepo.find();
        console.log('\n⏳ Seeding 2000 orders...');
        const ordersRepo = dataSource.getRepository(order_entity_1.Order);
        const orderItemsRepo = dataSource.getRepository(order_item_entity_1.OrderItem);
        const ordersToCreate = 2000;
        const orderBatchSize = 100;
        const allUsers = await usersRepo.find();
        for (let i = 0; i < ordersToCreate; i++) {
            const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
            const orderStatuses = Object.values(order_entity_1.OrderStatus);
            const randomStatus = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
            const order = ordersRepo.create({
                orderNumber: `ORD-${faker_1.faker.string.numeric(8)}`,
                user: randomUser,
                totalAmount: 0,
                status: randomStatus,
                shippingAddress: faker_1.faker.location.streetAddress({ useFullAddress: true }),
                notes: faker_1.faker.helpers.maybe(() => faker_1.faker.lorem.sentence(), {
                    probability: 0.3,
                }),
            });
            await ordersRepo.save(order);
            const itemCount = faker_1.faker.number.int({ min: 1, max: 5 });
            let orderTotal = 0;
            for (let j = 0; j < itemCount; j++) {
                const randomProduct = allProducts[Math.floor(Math.random() * allProducts.length)];
                const quantity = faker_1.faker.number.int({ min: 1, max: 5 });
                const price = randomProduct.price;
                const subtotal = quantity * Number(price);
                const orderItem = orderItemsRepo.create({
                    order: order,
                    product: randomProduct,
                    quantity: quantity,
                    price: price,
                    subtotal: subtotal,
                });
                await orderItemsRepo.save(orderItem);
                orderTotal += subtotal;
            }
            order.totalAmount = orderTotal;
            await ordersRepo.save(order);
            if ((i + 1) % orderBatchSize === 0) {
                console.log(`✅ Created ${i + 1}/${ordersToCreate} orders`);
            }
        }
        console.log(`✅ Created ${ordersToCreate} orders with items`);
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