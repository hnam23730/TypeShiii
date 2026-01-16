import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "blogs" })
export class Blog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar" })
    title: string;

    @Column("text")
    content: string;

    @Column({ type: "varchar" })
    author: string;

    @Column({ type: "varchar", nullable: true })
    imageUrl: string;

    @Column({ type: "text", nullable: true })
    categories: string;

    @Column({ type: "text", nullable: true })
    tags: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}