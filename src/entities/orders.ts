import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity({ name: "orders" })
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    customerName: string;

    @Column()
    customerEmail: string;

    @Column()
    customerPhone: string;

    @Column()
    customerAddress: string;

    @Column()
    total: number;

    @Column({ default: "Processing" }) // Trạng thái mặc định
    status: string;

    @CreateDateColumn()
    createdAt: Date;
}