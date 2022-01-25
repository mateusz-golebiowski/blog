import SqlQueries from "../../lib/sqlQueries";
import {Comment} from "../../Enitites/comments"
import {Article} from "../../Enitites/article"
import {getRepository, Like} from "typeorm";
import {Request, Response} from "express";
import DatabaseManager from "../../lib/DatabaseManager";

const validateData = (data: any) => {
    let correct = true;
    try {
        if (data.email.length === 0 || data.content.length === 0 || data.username.length === 0)
            correct = false;
    } catch (e) {
        correct = false;
    }
    return correct;
};

export const newComment = async (req: Request, res: Response) => {
    console.log(req.body);
    const article = new Article();
    article.id= Number.parseInt(req.params.postId);
    const newComment = new Comment();
    newComment.username = req.body.username
    newComment.email = req.body.email
    newComment.content = req.body.content
    newComment.article = article

    if (validateData(newComment)) {
        const connection = DatabaseManager.getInstance().getConnection();
        const comment = connection.getRepository(Comment);
        const result = await comment.save(newComment);
        const response: any = {};
        response.data = {
            ...result,
        };
        response.success = true;
        res.send(response);
    } else {
        const response = { success: 0, error: 'wrong data'};
        res.send(response);
    }
};

export const deleteComment = async (req: Request, res: Response) => {
    //@ts-ignore
    const role = Number.parseInt(req.user.decoded.role.id)
    if (role === 2 || role === 1) {
        const id = Number.parseInt(req.params.id)
        const connection = DatabaseManager.getInstance().getConnection();
        const comment = connection.getRepository(Comment);
        const result = await comment.delete(id)
        if (result){
            res.send({success:1});
        }else {
            res.send({success:0});
        }
    }
};

export const getComments = async (req: Request, res: Response) => {
    const postId = Number.parseInt(req.params.postId)
    const connection = DatabaseManager.getInstance().getConnection();
    const comment = connection.getRepository(Comment);
    const offset = (Number.parseInt(req.params.page)-1) * 10;
    const limit = offset + 10;
    const art = new Article();
    art.id = postId
    console.log(art)
    const [result, total] = await comment.findAndCount( {
        where: {
            article: art,
        },
        order: { createdAt: "DESC" },
        take: limit,
        skip: offset
    })
    const response: any = {};
    response.count = total;
    response.pages = Math.ceil(total/(limit-offset));
    response.comments = result;
    res.send(response);
};
