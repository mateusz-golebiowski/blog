import {Comment} from "../../Enitites/comments"
import {Article} from "../../Enitites/article"
import {getRepository, Like} from "typeorm";
import {Request, Response} from "express";
import DatabaseManager from "../../lib/DatabaseManager";
import {Category} from "../../Enitites/categories";
import {In} from "typeorm";

export const deleteComment = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id)
    const connection = DatabaseManager.getInstance().getConnection();
    const comment = connection.getRepository(Comment);
    const result = await comment.delete(id)
    if (result){
        res.send({success:1});
    }else {
        res.send({success:0});
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
    const [result, total] = await comment.findAndCount( {
        where: {
            article: Article,
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


export const newCategory = async (req: Request, res: Response) => {
    console.log(req.body);
    const category = new Category();
    category.name = req.body.name;
    const connection = DatabaseManager.getInstance().getConnection();
    const categoryRep = connection.getRepository(Category);
    const result = await categoryRep.save(category);
    const response: any = {};
    response.data = {
        ...result,
    };
    response.success = true;
    res.send(response);

};

export const getAllCategories = async (req: Request, res: Response) => {
    console.log(req.body);

    const connection = DatabaseManager.getInstance().getConnection();
    const categoryRep = connection.getRepository(Category);
    const result = await categoryRep.find({
        where: {deleted: false}
    });
    console.log(result)
    res.send(result)

};

export const getCategory = async (req: Request, res: Response) => {
    const id= Number.parseInt(req.params.categoryId);

    const connection = DatabaseManager.getInstance().getConnection();
    const categoryRep = connection.getRepository(Category);
    const category =  await categoryRep.find({
        where: {id: id }
    })
    res.send(category);

};

export const deleteCategory = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id)
    const connection = DatabaseManager.getInstance().getConnection();
    const categoryRepository = connection.getRepository(Category);
    const cat = new Category();
    cat.id = id;
    const result = await categoryRepository.findOne(cat)
    if (result) {
        result.deleted = true;
        await categoryRepository.save(result)
    }
    res.send({success:1});
};