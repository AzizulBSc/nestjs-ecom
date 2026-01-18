import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';
export declare enum OrderStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled"
}
export declare class Order {
    id: number;
    orderNumber: string;
    user: User;
    items: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    shippingAddress: string;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}
