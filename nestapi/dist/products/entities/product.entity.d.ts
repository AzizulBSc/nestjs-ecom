import { Category } from '../../categories/entities/category.entity';
export declare class Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string;
    sku: string;
    category: Category;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
