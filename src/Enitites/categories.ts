import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinColumn, JoinTable} from "typeorm";
import {Role} from "./role";
import {User} from "./user";
import {Language} from "./language";
import {Comment} from "./comments";
import {Article} from "./article";

@Entity({ name: "categories" })
export class Category {
    @PrimaryGeneratedColumn({ name: "category_id" })
    id!: number;

    @ManyToMany(() => Article, (article)=> article.categories)
    articles!: Article[];

    @Column()
    name!: string;
}