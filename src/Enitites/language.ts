import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import {Article} from "./article";

@Entity({ name: "languages" })
export class Language {
    @PrimaryGeneratedColumn({ name: "language_id" })
    id!: number;

    @OneToMany(type => Article, article => article.language)
    articles!: Article[];

    @Column({ name: "name" })
    name!: string;

    @Column({ name: "code" })
    code!: string;

    @Column()
    email!: string;

    @Column({ name: "created_at" })
    createdAt?: Date;

    @Column({ name: "updated_at" })
    updated?: Date;
}