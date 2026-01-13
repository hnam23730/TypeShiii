import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Role } from "./Role";
import { Post } from "./Post";
import { Token } from "./Token";
@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ default: true })
    isActive: boolean;

    @ManyToOne(() => Role, (role) => role.users)
    @JoinColumn({ name: "roleId" })
    role: Role;

    @Column({ nullable: true })
    roleId: number;

    @OneToMany(() => Post, (post: Post) => post.auth)
    posts?: Post[]
    
    @OneToMany(() => Token, (token: Token) => token.user)
    tokens?: Token[]

}