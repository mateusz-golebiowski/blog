import express from 'express';
import {createConnection, getRepository} from "typeorm";
import {Role} from "./Enitites/role";
import {User} from "./Enitites/user";
import {Comment} from "./Enitites/comments";
import {Article} from "./Enitites/article";
import {Language} from "./Enitites/language";
import api from './api';
import {UserRepository} from "./Repositories/user-repository";
import {RoleRepository} from "./Repositories/role-repository";
import DatabaseManager from "./lib/DatabaseManager";
import {Category} from "./Enitites/categories";
import bcrypt from "bcrypt";
(async () => {
    // Initialize a connection pool against the database.
    // const connection = await createConnection({
    //     name: 'postgres',
    //     type: "postgres",
    //     host: "localhost",
    //     port: 5432,
    //     username: "postgres",
    //     password: "postgres",
    //     database: "blog",
    //     entities: [User, Role, Comment,Article,Language],
    // });
    // const user = await connection.getRepository(User)
    // console.log(user)
    // console.log(1)
    // const result = await user.find()
    // if (result.length === 0) {
    //      const newPerson = new User();
    //      newPerson.firstName = "Admin";
    //      newPerson.lastName = "Admin";
    //      newPerson.email = "admin@admin";
    //      newPerson.password = "dsfdf";
    //     await user.save(newPerson)
    //
    // }
    // console.log(result)
    // console.log(2)
    //
    // const userRepository = connection.getCustomRepository(UserRepository);
    // const roleRepository = connection.getCustomRepository(RoleRepository);

    // Register a new person in the database by calling the repository.
   //  const newPerson = new User();
   //  newPerson.firstName = "Jane";
   //  newPerson.lastName = "Doe";
   //  newPerson.email = "5555555555";
   //  newPerson.password = "dsfdf";
   //
   // await userRepository.save(newPerson)

    // Clean up our connection pool so we can exit.
   // await connection.close();
//     const articleRepository = getRepository(Article);
//     const newArticle = new Article();
//     newArticle.user = {id: 1} as User;
//     newArticle.content = 'ddd'
//     newArticle.title = 'dddd'
//     newArticle.language = {id:1} as Language
//     newArticle.mainImage = '/dd'
// await articleRepository.save(newArticle)
//
//     const commentRepository= getRepository(Comment);
//     const newComment = new Comment();
//     newComment.content =' data.content';
//     newComment.username =' data.email';
//     newComment.language = {id:1} as Language; //todo
//     newComment.article= {id: 1} as Article
//     const result2 = await commentRepository.save(newComment);
//     console.log(result2)
    await DatabaseManager.getInstance().connect();
    const connection = DatabaseManager.getInstance().getConnection();
    const userRep = connection.getRepository(User);
    const languages = connection.getRepository(Language);
    const categories = connection.getRepository(Category);

    const resL = await languages.find({
        relations: ['categories', 'categories.category'],
    })
    const catRest = await categories.find({
        relations: ['languages', 'languages.language'],
    })
    console.log(resL)
    console.log(catRest)
    catRest.forEach(it => {
        console.log(it.languages)
    })
    const users = await userRep.find()
    if (users.length === 0) {
        const admin = new User();
        const role = new Role();
        role.id = 1;
        admin.role = role;
        admin.email = 'admin@admin.com'
        admin.firstName = 'Firstname'
        admin.lastName = 'lastname'
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync('zaq12wsx', salt);
        admin.password = hash
        await userRep.save(admin)
    }

    const app = express();

    const port = process.env.PORT || 4000;

    app.use('/api/v1', api);

    app.listen(port, () => {
        console.log('listen')
    });


})();

