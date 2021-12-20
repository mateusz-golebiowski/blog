import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, BeforeInsert, BeforeUpdate} from "typeorm";
import {Role} from "./role";
import {Article} from "./article";
import bcrypt from 'bcrypt';

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn({ name: "user_id" })
    id!: number;

    @ManyToOne(type => Role, role => role.users) @JoinColumn({ name: "role_id" })
    role!: Role;

    @OneToMany(type => Article, article => article.user)
    articles!: Article[];

    @Column({ name: "first_name" })
    firstName!: string;

    @Column({ name: "last_name" })
    lastName!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column({ name: "created_at" })
    createdAt?: Date;

    @Column({ name: "updated_at" })
    updated?: Date;

    // @BeforeInsert()
    // updateDates() {
    //     const salt = bcrypt.genSaltSync(10);
    //     const hash = bcrypt.hashSync(this.password, salt);
    //     this.password = hash;
    //
    // }
}