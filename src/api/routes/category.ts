import { Router } from 'express';
import {newComment, deleteComment, getComments} from "../controllers/comment";
import {auth} from '../controllers/auth';
import {deleteCategory, getAllCategories, getCategory, newCategory} from "../controllers/category";

const categoryRouter = Router();
categoryRouter.post('/',auth, newCategory);
categoryRouter.get('/:categoryId/', getCategory);
categoryRouter.get('/', getAllCategories);
categoryRouter.delete('/:id', auth, deleteCategory);

export default categoryRouter;