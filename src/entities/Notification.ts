import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' }) // e.g., 'new_order', 'new_review'
    type: string;

    @Column({ type: 'text' })
    message: string;

    @Column({ type: 'varchar', nullable: true })
    link: string; // e.g., /order or /admin/reviews

    @Column({ type: 'boolean', default: false })
    isRead: boolean;

    @CreateDateColumn()
    createdAt: Date;
}