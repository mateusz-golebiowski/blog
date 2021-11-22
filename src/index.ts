import express from 'express';
import { createConnection } from "typeorm";
import {Role} from "./Enitites/role";
import {User} from "./Enitites/user";
import api from './api';
import {UserRepository} from "./Repositories/user-repository";
import {RoleRepository} from "./Repositories/role-repository";

(async () => {
    // Initialize a connection pool against the database.
    const connection = await createConnection({
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "postgres",
        database: "blog",
        entities: [User, Role],
    });
    const userRepository = connection.getCustomRepository(UserRepository);
    const roleRepository = connection.getCustomRepository(RoleRepository);

    // Register a new person in the database by calling the repository.
    const newPerson = new User();
    newPerson.firstName = "Jane";
    newPerson.lastName = "Doe";
    newPerson.email = "5555555555";
    newPerson.password = "dsfdf";

   await userRepository.save(newPerson)

    // Clean up our connection pool so we can exit.
    await connection.close();
})();

const app = express();

// const port = process.env.PORT || 4000;
//
// app.use('/api/v1', api);
//
// app.listen(port, () => {
//
// });

export default  app;