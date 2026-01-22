import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Product } from "./Product";
import { User } from "./User"; // Giả sử bạn có Entity User

@Entity()
export class Review {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "int" })
    rating: number; // Đánh giá sao, ví dụ: 1 đến 5

    @Column({ type: "text", nullable: true })
    comment: string;

    @ManyToOne(() => User, user => user.reviews, { onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(() => Product, product => product.reviews, { onDelete: 'CASCADE' })
    product: Product;

    @Column({ type: "text", nullable: true })
    adminReply: string;

    @Column({ type: "timestamp", nullable: true })
    adminReplyAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // Constructor (tùy chọn)
    constructor(rating: number, comment: string, user: User, product: Product) {
        this.rating = rating;
        this.comment = comment;
        this.user = user;
        this.product = product;
    }
}