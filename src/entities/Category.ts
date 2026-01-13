import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Post } from "./Post";
import { Product } from "./Product";

@Entity({name: "categories"})
export class Category {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "varchar", nullable: true})
    name: string

    @OneToMany(() => Post, (post: Post) => post.category)
    posts: Post[]

    @OneToMany(() => Product, (product: Product) => product.category)
    products: Product[];
}