import { Router } from 'express';
import { newPost, getPost, getPosts, updatePost, deletePost } from '../controllers/post';
import multer from 'multer';
import {auth} from '../controllers/auth';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-'+ file.originalname)
    }
});

const up = multer({ storage: storage });

const postRouter = Router();
postRouter.post('/',auth, up.single('image'), newPost);
postRouter.put('/:id', auth, updatePost);
postRouter.get('/:page', getPosts);
postRouter.get('/show/:id', getPost);
postRouter.delete('/:id', auth, deletePost);

export default postRouter;