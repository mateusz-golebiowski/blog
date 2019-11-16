import { Router } from 'express';
import {newComment, deleteComment, getComments} from "../controllers/comment";

const commentRouter = Router();
commentRouter.post('/:postId', newComment);
commentRouter.get('/:postId/:page', getComments);
commentRouter.delete('/:id', deleteComment);

export default commentRouter;