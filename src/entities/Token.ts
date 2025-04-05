import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity({ name: "tokens" })
export class Token {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar" })
    key: string;

    @Column({ type: "varchar" })
    name: string;

    @Column({ type: "varchar", default: "active" })
    status: string;

    @ManyToOne(() => User, (user: User) => user.tokens)
    user?: User;
}