import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinColumn, JoinTable, OneToMany} from "typeorm";
import {Role} from "./role";
import {User} from "./user";
import {Language} from "./language";
import {Comment} from "./comments";
import {Article} from "./article";
import {LanguageToCategories} from "./languageToCategories";

@Entity({ name: "categories" })
export class Category {
    @PrimaryGeneratedColumn({ name: "category_id" })
    id!: number;

    @ManyToMany(() => Article, (article)=> article.categories)
    articles!: Article[];

    @OneToMany(() => LanguageToCategories, languageToCategories => languageToCategories.category)
    languages!: LanguageToCategories[];

    @Column()
    name!: string;
}