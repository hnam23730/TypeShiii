import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Category } from "./Category";

@Entity({ name: "products" })
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column("text")
    description: string;

    @Column("decimal")
    price: number;

    @Column()
    imageUrl: string;

    @Column()
    additionalImages: string; // Lưu danh sách ảnh phụ dưới dạng JSON

    @Column({ default: "In Stock" })
    availability: string;

    @Column("decimal", { nullable: true })
    height: number;

    @Column({ nullable: true })
    shippingDetails: string;

    @ManyToOne(() => Category, (category) => category.products, { nullable: true, onDelete: 'SET NULL' })
    category: Category | null;
}