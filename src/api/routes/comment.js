import { Router } from 'express';
import {newComment, deleteComment, getComments} from "../controllers/comment";
import {auth} from '../controllers/auth';

const commentRouter = Router();
commentRouter.post('/:postId', newComment);
commentRouter.get('/:postId/:page', getComments);
commentRouter.delete('/:id', auth, deleteComment);

export default commentRouter;