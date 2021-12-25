import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable} from "typeorm";
import {Role} from "./role";
import {User} from "./user";
import {Language} from "./language";
import {Comment} from "./comments";
import {Category} from "./categories";

@Entity({ name: "articles" })
export class Article {
    @PrimaryGeneratedColumn({ name: "article_id" })
    id!: number;

    @ManyToOne(type => User, user => user.articles) @JoinColumn({ name: "user_id" })
    user!: User;

    @ManyToOne(type => Language, language => language.articles) @JoinColumn({ name: "language_id" })
    language!: Language;

    @OneToMany(type => Comment, comment => comment.article)
    comments!: Comment[];

    @Column()
    title!: string;

    @Column()
    content!: string;

    @Column({name: 'mainimage'})
    mainImage!: string;

    @Column({ name: "created_at" })
    createdAt?: Date;

    @Column({ name: "updated_at" })
    updated?: Date;

    @ManyToMany(() => Category, (category) => category.articles)
    @JoinTable({
        name: "articles_categories",
        joinColumn: {
            name: "article_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "category_id",
            referencedColumnName: "id"
        }
    })
    categories!: Category[];
}