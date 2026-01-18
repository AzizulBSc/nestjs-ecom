# E-Commerce Admin Panel

Next.js 14 admin panel for the NestJS e-commerce backend with Redux Toolkit
state management.

## Features

- 🔐 JWT Authentication (Login/Logout)
- 👥 User Management with Roles
- 📦 Product Management with Categories
- 🏷️ Category Management
- 📋 Order Management with Status Updates
- 📊 Dashboard with Statistics
- 🎨 Modern UI with Tailwind CSS
- 🔄 Redux Toolkit for State Management
- 🔔 Toast Notifications

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Icons**: Heroicons
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js 18+
- NestJS backend running on http://localhost:3000/api

### Installation

```bash
cd /var/www/html/admin-panel
npm install
```

### Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Run Development Server

```bash
npm run dev
```

The admin panel will be available at
[http://localhost:3001](http://localhost:3001)

## Default Credentials

```
Email: admin@example.com
Password: admin123456
```

## Project Structure

```
admin-panel/
├── app/
│   ├── login/              # Login page
│   └── dashboard/          # Protected dashboard routes
│       ├── page.tsx        # Dashboard overview with stats
│       ├── users/          # User management
│       ├── products/       # Product management
│       ├── categories/     # Category management
│       └── orders/         # Order management
├── components/
│   ├── Sidebar.tsx         # Navigation sidebar
│   ├── DashboardLayout.tsx # Dashboard layout wrapper
│   ├── ProtectedRoute.tsx  # Route authentication guard
│   └── ReduxProvider.tsx   # Redux store provider
├── store/
│   ├── index.ts            # Redux store configuration
│   └── slices/             # Redux slices
│       ├── authSlice.ts
│       ├── usersSlice.ts
│       ├── productsSlice.ts
│       ├── categoriesSlice.ts
│       └── ordersSlice.ts
└── lib/
    ├── axios.ts            # Axios instance with interceptors
    └── types.ts            # TypeScript interfaces
```

## Features Overview

### Dashboard

- Total users, products, categories, orders
- Total revenue
- Recent orders table

### User Management

- View all users with roles
- Add/Edit/Delete users
- Assign roles (Admin, Manager, User)
- Toggle active status
- Password management

### Product Management

- View all products in table format
- Add/Edit/Delete products
- Set price, stock, SKU
- Assign to categories
- Toggle active status

### Category Management

- View categories in grid layout
- Add/Edit/Delete categories
- Toggle active status
- Manage descriptions

### Order Management

- View all orders with details
- Update order status (pending, processing, shipped, delivered, cancelled)
- View order items and totals
- Expandable order details

## API Integration

All API calls are made through Redux async thunks with axios interceptors
handling:

- JWT token injection
- Error handling
- Token refresh (if implemented)
- Automatic logout on 401

## State Management

Redux Toolkit slices for:

- `auth`: Login, logout, token management
- `users`: CRUD operations for users
- `products`: CRUD operations for products
- `categories`: CRUD operations for categories
- `orders`: Fetch and update orders

## Protected Routes

All dashboard routes are protected using the `ProtectedRoute` component which:

- Checks for authentication token in localStorage
- Redirects to /login if not authenticated
- Validates token on page load

## Styling

- Tailwind CSS 4 for utility-first styling
- Responsive design for mobile, tablet, desktop
- Modal forms for create/edit operations
- Toast notifications for user feedback
- Color-coded status badges

## Build for Production

```bash
npm run build
npm start
```

## Backend API Endpoints

The admin panel connects to these backend endpoints:

- `POST /auth/login` - User login
- `GET /users` - List users
- `POST /users` - Create user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /products` - List products
- `POST /products` - Create product
- `PATCH /products/:id` - Update product
- `DELETE /products/:id` - Delete product
- `GET /categories` - List categories
- `POST /categories` - Create category
- `PATCH /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category
- `GET /orders` - List orders
- `PATCH /orders/:id` - Update order

## Role-Based Access Control

The backend supports 3 roles:

- **Admin**: Full access to all features
- **Manager**: Limited administrative access
- **User**: Basic access

Permissions are enforced on the backend via guards and decorators.

## Troubleshooting

### "Network Error" when logging in

- Ensure backend is running on http://localhost:3000
- Check CORS settings in NestJS main.ts
- Verify .env.local has correct API_URL

### "Unauthorized" errors

- Check if token is valid
- Try logging out and logging back in
- Check backend JWT configuration

### Components not rendering

- Clear browser cache
- Check browser console for errors
- Ensure all dependencies are installed

## Future Enhancements

- [ ] Image upload for products/categories
- [ ] Advanced filtering and sorting
- [ ] Bulk operations
- [ ] Export data to CSV/Excel
- [ ] Real-time notifications
- [ ] Analytics charts
- [ ] Role-based UI restrictions
- [ ] Dark mode
- [ ] Multi-language support
