import {Comment} from "../../Enitites/comments"
import {Article} from "../../Enitites/article"
import {getRepository, Like} from "typeorm";
import {Request, Response} from "express";
import DatabaseManager from "../../lib/DatabaseManager";
import {Category} from "../../Enitites/categories";
import {In} from "typeorm";


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

export const updateCategory = async (req: Request, res: Response) => {
    //@ts-ignore
    const role = Number.parseInt(req.user.decoded.role.id)
    if (role === 1) {
        console.log(req.body);
        const id= Number.parseInt(req.params.id);
        console.log(id);

        const category = new Category();
        category.id = id
        category.name = req.body.name;
        const connection = DatabaseManager.getInstance().getConnection();
        const categoryRep = connection.getRepository(Category);
        const result = await categoryRep.findOne({
            where:{id: id}
        });
        if (result) {
            result.name = req.body.name;
            await categoryRep.save(result)
        }

        const response: any = {};
        response.data = {
            ...result,
        };
        response.success = true;
        res.send(response);
    }
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
    //@ts-ignore
    const role = Number.parseInt(req.user.decoded.role.id)
    if (role === 1) {
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
    }

};