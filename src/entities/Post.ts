import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Category } from "./Category";
import { User } from "./User";

@Entity({ name: "posts" })
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar" })
    title: string;

    @Column({ type: "varchar" })
    description?: string;

    @Column({ type: "text" })
    content: string;

    @ManyToOne(() => Category, (category: Category) => category.posts, { onDelete: "CASCADE" })
    @JoinColumn({ name: "categoryId" })
    category: Category;

    @Column({ type: "int" })
    categoryId: number;

    @ManyToOne(() => User, (auth: User) => auth.posts, { onDelete: "CASCADE" })
    @JoinColumn({ name: "authId" })
    auth: User;

    @Column({ type: "int" })
    authId: number;
}