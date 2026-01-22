import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Order } from "./orders";
import { Product } from "./Product";

@Entity({ name: "order_details" })
export class OrderDetail {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number; // Giá của sản phẩm tại thời điểm đặt hàng

    @ManyToOne(() => Order, order => order.orderDetails)
    @JoinColumn({ name: "orderId" })
    order: Order;

    @ManyToOne(() => Product, product => product.orderDetails, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: "productId" })
    product: Product | null;
}