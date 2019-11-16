import { Router } from 'express';
import { newPost, getPost, getPosts, updatePost, deletePost } from '../controllers/post';

const postRouter = Router();
postRouter.post('/', newPost);
postRouter.put('/:id', updatePost);
postRouter.get('/:page', getPosts);
postRouter.get('/show/:id', getPost);
postRouter.delete('/:id', deletePost);

export default postRouter;