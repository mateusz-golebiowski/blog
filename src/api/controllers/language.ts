import {checkToken, createToken} from  '../../lib/token';
import errors from '../../lib/errors';
import SqlQueries from "../../lib/sqlQueries";
import bcrypt from "bcrypt";
import {getConnection, getConnectionManager, getRepository} from "typeorm";
import {Request, Response} from "express";
import {User} from "../../Enitites/user";
import DatabaseManager from "../../lib/DatabaseManager";
import {Role} from "../../Enitites/role";
import Mailer from "../../lib/Mailer";
import {Not, Like, IsNull} from "typeorm";
import {Comment} from "../../Enitites/comments";
import {Language} from "../../Enitites/language";
import {Article} from "../../Enitites/article";


export const getLanguage = async (req: Request, res: Response) => {
    const connection = DatabaseManager.getInstance().getConnection();
    const languageRep = connection.getRepository(Language);
    const id = Number.parseInt(req.params.id)
    const result = await languageRep.find({
        where: {id: id}
    });

    res.send(result[0])

};
export const getAllLanguages = async (req: Request, res: Response) => {
    const connection = DatabaseManager.getInstance().getConnection();
    const languageRep = connection.getRepository(Language);
    const result = await languageRep.find();

    res.send(result)
};

export const addLanguage = async (req: Request, res: Response) => {
    const connection = DatabaseManager.getInstance().getConnection();
    const languageRep = connection.getRepository(Language);
    const newLanguage = new Language();
    newLanguage.name = req.body.name;
    newLanguage.code = req.body.code;
    const result = await languageRep.save(newLanguage);

    res.send(result)
};

export const deleteLanguage = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id)

    const connection = DatabaseManager.getInstance().getConnection();
    const languageRep = connection.getRepository(Language);
    const foundLanguage = await languageRep.findOne({where: {id: id},
        relations: ['articles', 'categories', 'articles.comments', 'articles.categories']
    })
    const articleRep = connection.getRepository(Article);
    const commentRep = connection.getRepository(Comment)

    if (foundLanguage) {
        console.log(foundLanguage)
        for (const art of foundLanguage.articles) {
            const comments = new Comment();
            comments.article = art;
            await commentRep.delete(comments)
            art.categories = [];
            art.comments = [];
            await articleRep.save(art);
            await articleRep.delete([art.id]);
        }
        foundLanguage.articles = [];
        foundLanguage.categories = [];
        await languageRep.save(foundLanguage)
        const result = await languageRep.delete([foundLanguage.id])
        res.send(result)
    }

};

export const editLanguage = async (req: Request, res: Response) => {
    // todo:

};

