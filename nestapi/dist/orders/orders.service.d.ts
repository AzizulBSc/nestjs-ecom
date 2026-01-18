import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
export declare class OrdersService {
    private ordersRepository;
    private orderItemsRepository;
    private productsRepository;
    private usersRepository;
    constructor(ordersRepository: Repository<Order>, orderItemsRepository: Repository<OrderItem>, productsRepository: Repository<Product>, usersRepository: Repository<User>);
    create(createOrderDto: CreateOrderDto, userId: number): Promise<Order>;
    findAll(): Promise<Order[]>;
    findByUser(userId: number): Promise<Order[]>;
    findOne(id: number): Promise<Order>;
    update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order>;
    remove(id: number): Promise<void>;
    private generateOrderNumber;
}
