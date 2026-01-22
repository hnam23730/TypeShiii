import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Category } from "./Category";
import { Review } from "./Review";
import { OrderDetail } from "./OrderDetail";

@Entity({ name: "products" })
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar" })
    name: string;

    @Column("text")
    description: string;

    @Column("decimal", { precision: 10, scale: 2 })
    price: number;

    @Column({ type: "varchar", nullable: true })
    imageUrl: string;

    @Column({ type: "text", nullable: true })
    additionalImages: string; // Lưu danh sách ảnh phụ dưới dạng JSON

    @Column({ type: "varchar", default: "In Stock" })
    availability: string;

    @Column("decimal", { precision: 5, scale: 2, nullable: true })
    height: number;

    @Column({ type: "text", nullable: true })
    shippingDetails: string;

    @ManyToOne(() => Category, (category) => category.products, { nullable: true, onDelete: 'SET NULL' })
    category: Category | null;

    @OneToMany(() => Review, review => review.product)
    reviews: Review[];

    @OneToMany(() => OrderDetail, orderDetail => orderDetail.product)
    orderDetails: OrderDetail[];
}