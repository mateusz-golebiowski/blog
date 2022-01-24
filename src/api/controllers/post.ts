import {removeFile} from '../../lib/file';
import SqlQueries from "../../lib/sqlQueries";
import {Request, Response} from "express";
import {Article} from "../../Enitites/article";
import DatabaseManager from "../../lib/DatabaseManager";
import {Language} from "../../Enitites/language";
import {User} from "../../Enitites/user";
import {Like, In} from "typeorm";
import {Category} from "../../Enitites/categories";
import category from "../routes/category";
import {Comment} from "../../Enitites/comments";
const prepareFileList = (content: any) => {
    return content.blocks.reduce((filtered: any, item: any)=>{
        if (item.type === 'image') {
            const filename = item.data.file.url.substring(item.data.file.url.lastIndexOf('/')+1);
            filtered.push(filename);
        }
        return filtered;
    }, []);
};
const validateData = (data: Article) => {
    let correct = true;
    if(data.title.length === 0 || data.content.length === 0 || data.mainImage.length === 0)
        correct = false;
    const content = JSON.parse(data.content);
    console.log(content);
    if (!Array.isArray(content.blocks))
        correct = false;
    return correct;
};

export const newPost = async (req: Request, res: Response) => {
    const newPost = new Article();
    newPost.content = req.body.content;
    newPost.title = req.body.title;
    // @ts-ignore
    newPost.mainImage = req.file.filename;
    // @ts-ignore
    newPost.user = req.user.decoded.id
    const lang = new Language();
    lang.id = Number(req.body.language);
    const categories = req.body.category.map((it: string) => {
        const category = new Category();
        category.id =Number(it);
        return category
    })

    newPost.language = lang;
    newPost.categories = categories;
    console.log(req.body)
    console.log(req.body.category)

    if (validateData(newPost)){
        const connection = DatabaseManager.getInstance().getConnection();
        const articleRep = connection.getRepository(Article);
        const result = await articleRep.save(newPost)

        const response: any = {};
        response.data = {
           ...result
        };
        response.success = true;
        res.send(response);

    }else {
       const response = { success: 0, error: 'wrong data'};
       res.send(response);
    }
};

export const updatePost = async (req: Request, res: Response) => {

    // todo: validate roles
    const postId = parseInt(req.params.id);
    const connection = DatabaseManager.getInstance().getConnection();
    const articleRep = connection.getRepository(Article);
    const editor = new User();
    // @ts-ignore
    editor.id = req.user.decoded.id;
    const article = await articleRep.find({
        where: {id: postId, user: editor}
    })

    if (article.length > 0) {
        console.log(article[0])
        const oldContent = JSON.parse(article[0].content);
        const oldImg = article[0].mainImage;
        article[0].title = req.body.title;
        article[0].content = req.body.content;
        // @ts-ignore
        if (req.file) {
            article[0].mainImage = req.file.filename;
        }
        if (validateData(article[0])){

            const oldImages = prepareFileList(oldContent);
            const newContent = JSON.parse(article[0].content);
            const newImages = prepareFileList(newContent);
            const imagesToRemove = oldImages.filter( ( el: string[] ) => !newImages.includes( el ) );

            if (req.file) {
                imagesToRemove.push(oldImg);
            }
            imagesToRemove.forEach( (item: string) =>{
                removeFile(item);
            });
            const result = await articleRep.save(article);
            const response: any = {};
            response.data = {
                ...article[0]
            };
            response.success = true;
            res.send(response);
        } else {
            const response = { success: 0, error: 'wrong data'};
            res.send(response);
        }
    } else {
        res.send('error');
    }
};

export const getPosts = async (req: Request, res: Response) => {
    const language = req.params.language;
    const offset = (Number.parseInt(req.params.page)-1) * 5;
    const limit = offset + 5;
    const connection = DatabaseManager.getInstance().getConnection();
    const articleRep = connection.getRepository(Article);
    const titleQuery = req.query.title ? `%${req.query.title}%` : '%';
    const category = req.query.category ? Number.parseInt(req.query.category as string) : 0;
    const lang = new Language()
    let result, total;
    lang.code = language

    if (category > 0) {
        const cat = new Category();
        cat.id = category;
        [result, total] = await articleRep.createQueryBuilder('article')
            .innerJoin('article.categories', 'category')
            .innerJoin('article.language', 'language')
            .where('category.category_id = :id', {id: category})
            .andWhere('language.code = :lang', {lang: lang.code})
            .andWhere('article.title LIKE :title', {title: titleQuery})
            .orderBy('article.createdAt', 'DESC')
            .take(limit).skip(offset)
            .getManyAndCount()
    } else {
        [result, total] = await articleRep.createQueryBuilder('article')
            .innerJoin('article.categories', 'category')
            .innerJoin('article.language', 'language')
            .where('language.code = :lang', {lang: lang.code})
            .andWhere('article.title LIKE :title', {title: titleQuery})
            .orderBy('article.createdAt', 'DESC')
            .take(limit).skip(offset)
            .getManyAndCount()
    }

    for (let i = 0; i < result.length ; i++) {
        result[i].user = (await connection.createQueryBuilder().relation(Article, 'user').of(result[i]).loadOne()) as User
    }

    const response: any = {};
    response.count = total;
    response.pages = Math.ceil(total/(limit-offset));
    response.posts = result;
    res.send(response);
};

export const getPost = async (req: Request, res: Response) => {
    const connection = DatabaseManager.getInstance().getConnection();
    const articleRep = connection.getRepository(Article);
    const articleId = Number.parseInt(req.params.id)
    const article = await articleRep.find({
        relations: ['categories', 'language', 'user'],
        where: {id: articleId}
    })
    let response: any;
    if (article.length === 1) {
        response = article[0];
        response.success = 1;
    } else {
        response = { success: 0, error: 'there is no post'}
    }
    res.send(response);
};

export const deletePost = async (req: Request, res: Response) => {
    const connection = DatabaseManager.getInstance().getConnection();
    const articleRep = connection.getRepository(Article);
    const articleId = Number.parseInt(req.params.id)
    const art = new Article();
    art.id= articleId
    const comments = new Comment();
    comments.article = art;
    const commentRep = connection.getRepository(Comment)
    await commentRep.delete(comments)

    const removed = await articleRep.find({
        where: {id: articleId},
        relations: ['categories']
    });
    removed[0].categories = [];
    await articleRep.save(removed[0]);
    const result = await articleRep.delete([articleId]);
    if (result) {
        const content = JSON.parse(removed[0].content);
        const imagesToRemove = prepareFileList(content);
        imagesToRemove.push(removed[0].mainImage);
        imagesToRemove.forEach( (item: string)=>{
            removeFile(item);
        });
        if (result){
            res.send({success:1});
        }else {
            res.send({success:0});
        }
    }
};
