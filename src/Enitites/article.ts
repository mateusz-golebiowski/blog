import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany} from "typeorm";
import {Role} from "./role";
import {User} from "./user";
import {Language} from "./language";
import {Comment} from "./comments";

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

    @Column()
    mainImage!: string;

    @Column({ name: "created_at" })
    createdAt?: Date;

    @Column({ name: "updated_at" })
    updated?: Date;
}