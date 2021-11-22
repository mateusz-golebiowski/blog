import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import {Role} from "./role";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn({ name: "user_id" })
    id!: number;
    @ManyToOne(type => Role, role => role.users) @JoinColumn({ name: "role_id" })

    role!: Role;

    @Column({ name: "first_name" })
    firstName!: string;

    @Column({ name: "last_name" })
    lastName!: string;

    @Column()
    email!: string;

    @Column()
    password!: string;

    @Column({ name: "created_at" })
    createdAt?: Date;

    @Column({ name: "updated_at" })
    updated?: Date;
}