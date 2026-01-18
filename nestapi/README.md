# NestJS E-Commerce API

A comprehensive e-commerce REST API built with NestJS, TypeORM, MySQL, and JWT authentication with role-based access control.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin, Manager, User)
  - Permission-based authorization
  - Secure password hashing with bcrypt

- **User Management**
  - User registration and login
  - User CRUD operations
  - Role assignment
  - User profile management

- **Product Management**
  - Product CRUD operations
  - Category management
  - Stock tracking
  - Product search and filtering

- **Order Management**
  - Create and manage orders
  - Order tracking
  - Order status updates
  - Order history

- **Admin Panel Features**
  - User management with role assignment
  - Product and category management
  - Order management
  - Full CRUD operations with role restrictions

## 📋 Prerequisites

- Node.js (v18 or higher)
- MySQL (v8 or higher)
- npm or yarn

## 🔧 Installation

1. **Install dependencies**

```bash
npm install
```

2. **Configure environment variables**

The `.env` file is already configured with:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=pma_user
DB_PASSWORD=StrongPass123!
DB_DATABASE=nestjs

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

3. **Create MySQL database**

```bash
mysql -u pma_user -p'StrongPass123!' -e "CREATE DATABASE IF NOT EXISTS nestjs;"
```

4. **Run database seeder**

```bash
npm run seed
```

This will create:

- Default roles (Admin, Manager, User)
- Permissions for all modules
- Admin user account:
  - Email: `admin@example.com`
  - Password: `admin123456`

## 🏃 Running the Application

### Development mode

```bash
npm run start:dev
```

### Production mode

```bash
npm run build
npm run start:prod
```

The API will be available at: `http://localhost:3000/api`

## 📚 API Documentation

For detailed API documentation, see [API_ENDPOINTS.md](API_ENDPOINTS.md)

### Quick Overview

#### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

#### Users (Admin/Manager only)

- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

#### Categories

- `GET /api/categories` - Get all categories (Public)
- `POST /api/categories` - Create category (Admin/Manager)

#### Products

- `GET /api/products` - Get all products (Public)
- `POST /api/products` - Create product (Admin/Manager)

#### Orders

- `GET /api/orders` - Get all orders (Admin/Manager)
- `GET /api/orders/my-orders` - Get current user's orders
- `POST /api/orders` - Create order (Authenticated)

## 🔐 Default Credentials

After running the seeder:

**Admin Account:**

- Email: `admin@example.com`
- Password: `admin123456`

## 👥 Roles & Permissions

### Admin

- Full access to all endpoints
- User management
- Product and category management
- Order management

### Manager

- View users
- Manage products and categories
- Manage orders
- Cannot delete users

### User

- View products and categories
- Create and view own orders
- Cannot access admin endpoints

## 🗂️ Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── decorators/       # Custom decorators (Roles, CurrentUser)
│   ├── dto/             # Data transfer objects
│   ├── guards/          # Auth guards (JWT, Roles)
│   └── strategies/      # Passport strategies
├── users/               # User management module
├── roles/               # Roles and permissions module
├── products/            # Product management module
├── categories/          # Category management module
├── orders/              # Order management module
├── app.module.ts        # Root module
├── main.ts             # Application entry point
└── seed.ts             # Database seeder
```

## 🛠️ Technologies Used

- **NestJS** - Progressive Node.js framework
- **TypeORM** - ORM for TypeScript and JavaScript
- **MySQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **Passport** - Authentication middleware
- **bcrypt** - Password hashing
- **class-validator** - Validation decorators
- **class-transformer** - Object transformation

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control
- Input validation with class-validator
- SQL injection prevention with TypeORM
- CORS enabled

## 📝 Scripts

```bash
# Development
npm run start:dev        # Start in development mode

# Production
npm run build           # Build the project
npm run start:prod      # Start in production mode

# Database
npm run seed            # Seed database with initial data

# Testing
npm run test            # Run unit tests
npm run test:e2e        # Run e2e tests
npm run test:cov        # Run tests with coverage
```

## 📄 License

This project is licensed under the UNLICENSED license.
