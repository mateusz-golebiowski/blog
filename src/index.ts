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
    const user = connection.getRepository(User);
    user.find()
        .then(async (result) => {
            console.log(result) // todo: user create if there is no user in db
        })
    const app = express();

    const port = process.env.PORT || 4000;

    app.use('/api/v1', api);

    app.listen(port, () => {
        console.log('listen')
    });


})();

