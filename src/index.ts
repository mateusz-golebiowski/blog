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

