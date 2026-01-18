"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
const order_item_entity_1 = require("./entities/order-item.entity");
const product_entity_1 = require("../products/entities/product.entity");
const user_entity_1 = require("../users/entities/user.entity");
let OrdersService = class OrdersService {
    ordersRepository;
    orderItemsRepository;
    productsRepository;
    usersRepository;
    constructor(ordersRepository, orderItemsRepository, productsRepository, usersRepository) {
        this.ordersRepository = ordersRepository;
        this.orderItemsRepository = orderItemsRepository;
        this.productsRepository = productsRepository;
        this.usersRepository = usersRepository;
    }
    async create(createOrderDto, userId) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        const order = this.ordersRepository.create({
            user,
            orderNumber: this.generateOrderNumber(),
            shippingAddress: createOrderDto.shippingAddress,
            notes: createOrderDto.notes,
            totalAmount: 0,
        });
        const savedOrder = await this.ordersRepository.save(order);
        let totalAmount = 0;
        const orderItems = [];
        for (const item of createOrderDto.items) {
            const product = await this.productsRepository.findOne({
                where: { id: item.productId },
            });
            if (!product) {
                throw new common_1.NotFoundException(`Product with ID ${item.productId} not found`);
            }
            if (product.stock < item.quantity) {
                throw new common_1.BadRequestException(`Insufficient stock for product: ${product.name}`);
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
            product.stock -= item.quantity;
            await this.productsRepository.save(product);
        }
        await this.orderItemsRepository.save(orderItems);
        savedOrder.totalAmount = totalAmount;
        return this.ordersRepository.save(savedOrder);
    }
    async findAll() {
        return this.ordersRepository.find({
            relations: ['user', 'items', 'items.product'],
        });
    }
    async findByUser(userId) {
        return this.ordersRepository.find({
            where: { user: { id: userId } },
            relations: ['items', 'items.product'],
        });
    }
    async findOne(id) {
        const order = await this.ordersRepository.findOne({
            where: { id },
            relations: ['user', 'items', 'items.product'],
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        return order;
    }
    async update(id, updateOrderDto) {
        const order = await this.findOne(id);
        Object.assign(order, updateOrderDto);
        return this.ordersRepository.save(order);
    }
    async remove(id) {
        const order = await this.findOne(id);
        await this.ordersRepository.remove(order);
    }
    generateOrderNumber() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `ORD-${timestamp}-${random}`;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OrdersService);
//# sourceMappingURL=orders.service.js.map