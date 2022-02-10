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
        const languageCatRep = connection.getRepository(LanguageToCategories);
        let langs =  (await languageCatRep.find({
            relations: ['language', 'category']
        })).filter(it => it.category.deleted === false && Number(it.category.id) === id);
        console.log('langs')
        console.log(langs)
        console.log(req.body)
        const languagesRep = connection.getRepository(Language);
        const allLanguages = await languagesRep.find();
        const result = await categoryRep.findOne({
            where:{id: id}
        });
        for (const l of req.body.languageData) {
            const f = langs.findIndex(it => it.language.code === l.code)
            if (f !== -1) {
                langs[f].value =  l.value
            } else {
                const newL = new LanguageToCategories();
                if (result) {
                    newL.category = result;
                }
                const fl = allLanguages.find(it => it.code === l.code)
                if (fl) {
                    newL.language = fl
                }
                newL.value = l.value;
                langs.push(newL)

            }
        }
        await languageCatRep.save(langs)

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
    const lang = req.query.lang || 'en'
    const all = req.query.all==='true'

    const connection = DatabaseManager.getInstance().getConnection();
    const categoryRep = connection.getRepository(Category);
    const languageCatRep = connection.getRepository(LanguageToCategories);

    let langs: LanguageToCategories[];
    if (all) {
        langs =  (await languageCatRep.find({
            relations: ['language', 'category']
        })).filter(it => it.category.deleted === false);
        const result = await categoryRep.find({
            where: {deleted: false}
        });
        const response = result.map( it => {
            return {
                id: it.id,
                name: it.name,
                languageData: langs.filter(el => el.category.id === it.id).map(el=> ({code: el.language.code,value: el.value}))
            }
        })
        res.send(response)
    } else {
        langs = (await languageCatRep.find({
            relations: ['language', 'category']
        })).filter(it => it.category.deleted === false && it.language.code === lang);
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
        res.send(response)
    }


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