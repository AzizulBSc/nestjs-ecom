import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Role, RoleType } from './roles/entities/role.entity';
import { Permission } from './roles/entities/permission.entity';
import { User } from './users/entities/user.entity';
import { Category } from './categories/entities/category.entity';
import { Product } from './products/entities/product.entity';
import { Order, OrderStatus } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item.entity';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

async function seedDatabase() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    console.log('🗑️  Clearing existing data...\n');

    // Clear data in correct order (respecting foreign key constraints)
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
      const permission = permissionsRepo.create(permData);
      await permissionsRepo.save(permission);
      permissions.push(permission);
    }

    console.log('✅ Permissions created');

    // Create Roles
    const rolesRepo = dataSource.getRepository(Role);

    // Admin role with all permissions
    const adminRole = rolesRepo.create({
      name: RoleType.ADMIN,
      description: 'Administrator with full access',
      permissions: permissions,
    });
    await rolesRepo.save(adminRole);

    // Manager role with limited permissions
    const managerRole = rolesRepo.create({
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

    // User role with basic permissions
    const userRole = rolesRepo.create({
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

    console.log('✅ Roles created');

    // Create Admin User
    const usersRepo = dataSource.getRepository(User);
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
    // Use { listeners: false } to skip BeforeInsert hook since password is already hashed
    await usersRepo.save(adminUser, { listeners: false });
    console.log(
      '✅ Admin user created (email: admin@example.com, password: admin123456)',
    );

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

    // Seed Categories
    console.log('\n⏳ Seeding categories...');
    const categoriesRepo = dataSource.getRepository(Category);
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

    const categories: Category[] = [];
    for (const catName of categoryNames) {
      const category = categoriesRepo.create({
        name: catName,
        description: faker.commerce.productDescription(),
        image: faker.image.url(),
        isActive: true,
      });
      await categoriesRepo.save(category);
      categories.push(category);
    }
    console.log(`✅ Created ${categories.length} categories`);

    // Seed Products
    console.log('\n⏳ Seeding 1000 products...');
    const productsRepo = dataSource.getRepository(Product);
    const productsToCreate = 1000;
    const productBatchSize = 200;
    let productsBatch: Product[] = [];

    for (let i = 0; i < productsToCreate; i++) {
      const randomCategory =
        categories[Math.floor(Math.random() * categories.length)];

      const product = productsRepo.create({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
        stock: faker.number.int({ min: 0, max: 500 }),
        image: faker.image.url(),
        sku: faker.string.alphanumeric(10).toUpperCase(),
        category: randomCategory,
        isActive: true,
      });

      productsBatch.push(product);

      if (productsBatch.length >= productBatchSize) {
        await productsRepo.save(productsBatch);
        console.log(
          `✅ Saved batch of ${productBatchSize} products (${i + 1}/${productsToCreate})`,
        );
        productsBatch = [];
      }
    }

    if (productsBatch.length > 0) {
      await productsRepo.save(productsBatch);
      console.log(`✅ Saved final batch of ${productsBatch.length} products`);
    }

    // Get all products for order creation
    const allProducts = await productsRepo.find();

    // Seed Orders
    console.log('\n⏳ Seeding 2000 orders...');
    const ordersRepo = dataSource.getRepository(Order);
    const orderItemsRepo = dataSource.getRepository(OrderItem);
    const ordersToCreate = 2000;
    const orderBatchSize = 100;

    // Get all users for order creation
    const allUsers = await usersRepo.find();

    for (let i = 0; i < ordersToCreate; i++) {
      const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
      const orderStatuses = Object.values(OrderStatus);
      const randomStatus =
        orderStatuses[Math.floor(Math.random() * orderStatuses.length)];

      // Create order
      const order = ordersRepo.create({
        orderNumber: `ORD-${faker.string.numeric(8)}`,
        user: randomUser,
        totalAmount: 0, // Will calculate after items
        status: randomStatus,
        shippingAddress: faker.location.streetAddress({ useFullAddress: true }),
        notes: faker.helpers.maybe(() => faker.lorem.sentence(), {
          probability: 0.3,
        }),
      });

      await ordersRepo.save(order);

      // Create 1-5 order items
      const itemCount = faker.number.int({ min: 1, max: 5 });
      let orderTotal = 0;

      for (let j = 0; j < itemCount; j++) {
        const randomProduct =
          allProducts[Math.floor(Math.random() * allProducts.length)];
        const quantity = faker.number.int({ min: 1, max: 5 });
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

      // Update order total
      order.totalAmount = orderTotal;
      await ordersRepo.save(order);

      if ((i + 1) % orderBatchSize === 0) {
        console.log(`✅ Created ${i + 1}/${ordersToCreate} orders`);
      }
    }

    console.log(`✅ Created ${ordersToCreate} orders with items`);

    console.log('\n🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await app.close();
  }
}

seedDatabase();
