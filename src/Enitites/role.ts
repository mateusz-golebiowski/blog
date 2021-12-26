import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import {User} from "./user";

@Entity({ name: "roles" })
export class Role {
    @PrimaryGeneratedColumn({ name: "role_id" })
    id!: number;
    @OneToMany(type => User, user => user.role)
    users!: User[];
    @Column()
    name!: string;


}