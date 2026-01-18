export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  isActive: boolean;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: number;
  name: "admin" | "manager" | "user";
  description?: string;
  permissions?: Permission[];
}

export interface Permission {
  id: number;
  name: string;
  description?: string;
  module?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
  sku?: string;
  category: Category;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  user: User;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}
