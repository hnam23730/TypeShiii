import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Category } from "./Catergory";

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

    @Column({ default: "In Stock" })
    availability: string;

    @Column("decimal", { nullable: true })
    height: number;

    @Column({ nullable: true })
    shippingDetails: string;

    @ManyToOne(() => Category, (category) => category.products, { nullable: true })
    category: Category | null;
}