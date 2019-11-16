import express from 'express';
import userRouter from './routes/user';
import postRouter from './routes/post';
import db from '../models/index';
import { User } from '../models';


db.sequelize.sync()
    .then(() =>
    {
        User.findAll().then(async result => {
            if (result.length === 0 ){
                User.create({username:'admin', password:'admin'});
            }
        });
    });



const api = express();

api.use(express.json());
api.use(express.urlencoded({ extended: true }));

api.get('/', (req, res) => {
    res.send({
        message: 'Hello from the API',
    });
});

api.use('/user', userRouter);
api.use('/post', postRouter);

export default  api;
