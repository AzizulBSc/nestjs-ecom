import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: number): Promise<Order> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Create order
    const order = this.ordersRepository.create({
      user,
      orderNumber: this.generateOrderNumber(),
      shippingAddress: createOrderDto.shippingAddress,
      notes: createOrderDto.notes,
      totalAmount: 0,
    });

    const savedOrder = await this.ordersRepository.save(order);

    // Create order items
    let totalAmount = 0;
    const orderItems: OrderItem[] = [];

    for (const item of createOrderDto.items) {
      const product = await this.productsRepository.findOne({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException(
          `Product with ID ${item.productId} not found`,
        );
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product: ${product.name}`,
        );
      }

      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      const orderItem = this.orderItemsRepository.create({
        order: savedOrder,
        product,
        quantity: item.quantity,
        price: product.price,
        subtotal,
      });

      orderItems.push(orderItem);

      // Update product stock
      product.stock -= item.quantity;
      await this.productsRepository.save(product);
    }

    await this.orderItemsRepository.save(orderItems);

    // Update order total
    savedOrder.totalAmount = totalAmount;
    return this.ordersRepository.save(savedOrder);
  }

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: ['user', 'items', 'items.product'],
    });
  }

  async findByUser(userId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    Object.assign(order, updateOrderDto);
    return this.ordersRepository.save(order);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await this.ordersRepository.remove(order);
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${random}`;
  }
}
