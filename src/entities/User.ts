import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Role } from "./Role";
import { Post } from "./Post";
import { Token } from "./Token";
import { Review } from "./Review";
@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", unique: true })
    email: string;

    @Column({ type: "varchar" })
    password: string;

    @Column({ type: "boolean", default: true })
    isActive: boolean;

    @ManyToOne(() => Role, (role) => role.users)
    @JoinColumn({ name: "roleId" })
    role: Role;

    @Column({ type: "int", nullable: true })
    roleId: number;

    @OneToMany(() => Post, (post: Post) => post.auth)
    posts?: Post[]
    
    @OneToMany(() => Token, (token: Token) => token.user)
    tokens?: Token[]

    @OneToMany(() => Review, review => review.user)
    reviews: Review[];

}