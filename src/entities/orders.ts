import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity({ name: "orders" })
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar" })
    customerName: string;

    @Column({ type: "varchar" })
    customerEmail: string;

    @Column({ type: "varchar" })
    customerPhone: string;

    @Column({ type: "varchar" })
    customerAddress: string;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    total: number;

    @Column({ type: "varchar", default: "Processing" }) // Trạng thái mặc định
    status: string;

    @CreateDateColumn()
    createdAt: Date;
}