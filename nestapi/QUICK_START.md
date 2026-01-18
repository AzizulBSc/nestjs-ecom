# Quick Start Guide

## 🚀 Your NestJS E-Commerce API is Ready!

The application is now running at: **http://localhost:3000/api**

### ✅ What's Been Created

1. **Complete E-Commerce Backend** with:
   - User Authentication & Authorization (JWT)
   - Role-Based Access Control (Admin, Manager, User)
   - Product & Category Management
   - Order Management System
   - MySQL Database Integration

2. **Database Setup**:
   - MySQL Database: `nestjs`
   - All tables created and seeded
   - Admin user ready to use

### 🔑 Default Admin Credentials

```
Email: admin@example.com
Password: admin123456
```

### 📝 Test the API

#### 1. Login as Admin

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123456"
  }'
```

Save the `access_token` from the response!

#### 2. Create a Category

```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Electronics",
    "description": "Electronic devices and accessories"
  }'
```

#### 3. Create a Product

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 999.99,
    "stock": 10,
    "categoryId": 1
  }'
```

#### 4. Get All Products (Public - No Auth Required)

```bash
curl http://localhost:3000/api/products
```

#### 5. Register a New User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

#### 6. Create an Order (as logged-in user)

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer USER_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": 1,
        "quantity": 2
      }
    ],
    "shippingAddress": "123 Main St, City, Country"
  }'
```

### 📚 Full API Documentation

See [API_ENDPOINTS.md](API_ENDPOINTS.md) for complete API reference.

### 🛠️ Available Commands

```bash
# Start development server
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod

# Seed database
npm run seed
```

### 📂 Project Structure

```
src/
├── auth/           # JWT authentication & guards
├── users/          # User management
├── roles/          # Roles & permissions
├── products/       # Product management
├── categories/     # Category management
├── orders/         # Order management
└── seed.ts         # Database seeder
```

### 🔐 Role Hierarchy

- **Admin**: Full access to everything
- **Manager**: Manage products, categories, orders (cannot delete users)
- **User**: View products, create orders

### 🌐 API Base URL

All endpoints are prefixed with `/api`:

- http://localhost:3000/api/auth/login
- http://localhost:3000/api/products
- http://localhost:3000/api/orders
- etc.

### 📊 Database Info

- **Host**: localhost
- **Port**: 3306
- **Database**: nestjs
- **Username**: pma_user
- **Password**: StrongPass123!

### 🎯 Next Steps

1. Test the API endpoints using the examples above
2. Create categories and products
3. Register users and test ordering
4. Customize the business logic as needed
5. Add more features (reviews, cart, payments, etc.)

### 📖 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [JWT Documentation](https://jwt.io)

### 🤝 Need Help?

Check the detailed documentation in:

- `README.md` - Full project documentation
- `API_ENDPOINTS.md` - Complete API reference

---

**Happy Coding! 🎉**
