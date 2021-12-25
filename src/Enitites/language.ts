import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import {Article} from "./article";
import {LanguageToCategories} from "./languageToCategories";

@Entity({ name: "languages" })
export class Language {
    @PrimaryGeneratedColumn({ name: "language_id" })
    id!: number;

    @OneToMany(type => Article, article => article.language)
    articles!: Article[];

    @OneToMany(() => LanguageToCategories, languageToCategories => languageToCategories.language)
    categories!: LanguageToCategories[];

    @Column({ name: "name" })
    name!: string;

    @Column({ name: "code" })
    code!: string;
}