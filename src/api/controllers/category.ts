import {Comment} from "../../Enitites/comments"
import {Article} from "../../Enitites/article"
import {getRepository, Like} from "typeorm";
import {Request, Response} from "express";
import DatabaseManager from "../../lib/DatabaseManager";
import {Category} from "../../Enitites/categories";
import {In} from "typeorm";
import {LanguageToCategories} from "../../Enitites/languageToCategories";
import {Language} from "../../Enitites/language";


export const newCategory = async (req: Request, res: Response) => {
    console.log(req.body);
    const category = new Category();
    category.name = req.body.name;
    const connection = DatabaseManager.getInstance().getConnection();
    const categoryRep = connection.getRepository(Category);
    const languagesToCategoryRep = connection.getRepository(LanguageToCategories);
    const languagesRep = connection.getRepository(Language);
    const allLanguages = await languagesRep.find();
    const languagesToCategories :LanguageToCategories[] = []

    const result = await categoryRep.save(category);
    for (const item of req.body.languageData) {
        const found = allLanguages.find(lang => lang.code === item.code)
        if (found) {
            const newLangToCat = new LanguageToCategories()
            newLangToCat.category =result
            newLangToCat.language = found;
            newLangToCat.value = item.value
            languagesToCategories.push(newLangToCat)
        }
    }
    await languagesToCategoryRep.save(languagesToCategories)
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
    const lang = req.query.lang || 'en'
    console.log(req.query)
    console.log(lang)
    const connection = DatabaseManager.getInstance().getConnection();
    const categoryRep = connection.getRepository(Category);
    const languageCatRep = connection.getRepository(LanguageToCategories);

    const langs = (await languageCatRep.find({
        relations: ['language', 'category']
    })).filter(it => it.category.deleted === false && it.language.code === lang);
    console.log(langs)

    const result = await categoryRep.find({
        where: {deleted: false}
    });
    const response = result.map( it => {
        const found = langs.find((el) => el.category.id === it.id)
        return {
            id: it.id,
            name: found ? found.value : it.name,
        }
    })
    console.log(response)
    res.send(response)

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