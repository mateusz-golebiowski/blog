import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinColumn, JoinTable, ManyToOne} from "typeorm";
import {Role} from "./role";
import {User} from "./user";
import {Language} from "./language";
import {Comment} from "./comments";
import {Article} from "./article";
import {Category} from "./categories";

@Entity({ name: "languages_categories" })
export class LanguageToCategories {
    @PrimaryGeneratedColumn({ name: "language_category_id" })
    id!: number;
    @Column()
    value!: string;
    @ManyToOne(() => Category, (category) => category.languages) @JoinColumn({ name: "category_id" })
    category!: Category;
    @ManyToOne(() => Language, (language) => language.categories) @JoinColumn({ name: "language_id" })
    language!: Language;
}