import {Connection, createConnection} from "typeorm";
import {User} from "../Enitites/user";
import {Role} from "../Enitites/role";
import {Comment} from "../Enitites/comments";
import {Article} from "../Enitites/article";
import {Language} from "../Enitites/language";

class DatabaseManager {
    private static instance: DatabaseManager;
    private connection!: Connection;
    private constructor() {
    }
    async connect() {
        this.connection = await createConnection({
            name: 'postgres',
            type: "postgres",
            host: "localhost",
            port: 5432,
            username: "postgres",
            password: "postgres",
            database: "blog",
            entities: [User, Role, Comment,Article,Language],
        });
    }
    public static getInstance(): DatabaseManager {
        if (!DatabaseManager.instance) {
            DatabaseManager.instance = new DatabaseManager();
        }

        return DatabaseManager.instance;
    }
    public getConnection() {
        return this.connection;
    }

}

export default DatabaseManager