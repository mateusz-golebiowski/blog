import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import {User} from "./user";

@Entity({ name: "roles" })
export class Role {
    @PrimaryGeneratedColumn({ name: "role_id" })
    id!: number;
    @OneToMany(type => User, user => user.role)
    users!: User[];

    @Column({ name: "first_name" })
    firstName!: string;

    @Column({ name: "last_name" })
    last_name!: string;

    @Column()
    email!: string;

    @Column({ name: "created_at" })
    createdAt?: Date;

    @Column({ name: "updated_at" })
    updated?: Date;
}