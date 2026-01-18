# E-Commerce API Endpoints

Base URL: `http://localhost:3000/api`

## Authentication

### Register

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123456"
}
```

## Users (Requires Authentication)

### Get All Users (Admin/Manager)

```http
GET /users
Authorization: Bearer <token>
```

### Get User by ID (Admin/Manager)

```http
GET /users/1
Authorization: Bearer <token>
```

### Create User (Admin)

```http
POST /users
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123",
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+1234567890",
  "roleId": 3
}
```

### Update User (Admin)

```http
PATCH /users/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Updated Name",
  "isActive": true
}
```

### Delete User (Admin)

```http
DELETE /users/1
Authorization: Bearer <token>
```

## Categories

### Get All Categories (Public)

```http
GET /categories
```

### Get Category by ID (Public)

```http
GET /categories/1
```

### Create Category (Admin/Manager)

```http
POST /categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Electronic devices and accessories",
  "image": "https://example.com/electronics.jpg",
  "isActive": true
}
```

### Update Category (Admin/Manager)

```http
PATCH /categories/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Electronics",
  "description": "Updated description"
}
```

### Delete Category (Admin)

```http
DELETE /categories/1
Authorization: Bearer <token>
```

## Products

### Get All Products (Public)

```http
GET /products
```

### Get Product by ID (Public)

```http
GET /products/1
```

### Create Product (Admin/Manager)

```http
POST /products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "iPhone 15 Pro",
  "description": "Latest iPhone with advanced features",
  "price": 999.99,
  "stock": 50,
  "sku": "IPH15PRO",
  "image": "https://example.com/iphone15.jpg",
  "categoryId": 1,
  "isActive": true
}
```

### Update Product (Admin/Manager)

```http
PATCH /products/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "price": 899.99,
  "stock": 45
}
```

### Delete Product (Admin)

```http
DELETE /products/1
Authorization: Bearer <token>
```

## Orders

### Get All Orders (Admin/Manager)

```http
GET /orders
Authorization: Bearer <token>
```

### Get My Orders (Authenticated User)

```http
GET /orders/my-orders
Authorization: Bearer <token>
```

### Get Order by ID (Authenticated)

```http
GET /orders/1
Authorization: Bearer <token>
```

### Create Order (Authenticated)

```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 2,
      "quantity": 1
    }
  ],
  "shippingAddress": "123 Main Street, New York, NY 10001",
  "notes": "Please deliver between 9 AM - 5 PM"
}
```

### Update Order Status (Admin/Manager)

```http
PATCH /orders/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "shipped"
}
```

**Available statuses:** `pending`, `processing`, `shipped`, `delivered`, `cancelled`

### Delete Order (Admin)

```http
DELETE /orders/1
Authorization: Bearer <token>
```

## Roles

### Get All Roles (Admin)

```http
GET /roles
Authorization: Bearer <token>
```

### Get All Permissions (Admin)

```http
GET /roles/permissions
Authorization: Bearer <token>
```

## Default Credentials

After running the seeder:

**Admin Account:**

- Email: `admin@example.com`
- Password: `admin123456`

## Role Hierarchy

1. **Admin** (Full Access)
   - All permissions
   - User management
   - Complete CRUD on all resources

2. **Manager** (Limited Access)
   - View users
   - Manage products, categories, orders
   - Cannot delete users

3. **User** (Basic Access)
   - View products and categories
   - Create and view own orders
   - No admin access
