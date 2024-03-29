import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import {Role} from "./role";
import {User} from "./user";
import {Language} from "./language";
import {Article} from "./article";

@Entity({ name: "comments" })
export class Comment {
    @PrimaryGeneratedColumn({ name: "comment_id" })
    id!: number;

    @ManyToOne(type => Article, article => article.comments) @JoinColumn({ name: "article_id" })
    article!: Article;

    @Column()
    username!: string;

    @Column()
    email!: string;

    @Column()
    content!: string;

    @Column({ name: "created_at" })
    createdAt?: Date;

    @Column({ name: "updated_at" })
    updated?: Date;
}