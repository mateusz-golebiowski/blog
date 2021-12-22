import express from 'express';
import cors from 'cors';
import userRouter from './routes/user';
import postRouter from './routes/post';
import commentRouter from './routes/comment';
import imageRouter from './routes/image';
import {getRepository} from "typeorm";
import {User} from "../Enitites/user";
import DatabaseManager from "../lib/DatabaseManager";

// db.sequelize.sync()
//     .then(() =>
//     {
//         User.findAll().then(async result => {
//             if (result.length === 0 ){
//                 User.create({username:'admin', password:'admin'});
//             }
//         });
//     });



const api = express();

api.use(cors());
api.use(express.json());
api.use(express.urlencoded({ extended: true }));

api.get('/', (req, res) => {
    res.send({
        message: 'Hello from the API',
    });
});

api.use('/user', userRouter);
api.use('/post', postRouter);
api.use('/comment', commentRouter);
api.use('/image', imageRouter);
api.all('*', (req, res)=>{
    res.status(404).send('');
});
export default  api;
