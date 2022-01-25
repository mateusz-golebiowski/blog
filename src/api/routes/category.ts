import { Router } from 'express';
import {auth} from '../controllers/auth';
import {deleteCategory, getAllCategories, getCategory, newCategory, updateCategory} from "../controllers/category";

const categoryRouter = Router();
categoryRouter.post('/',auth, newCategory);
categoryRouter.put('/:id',auth, updateCategory);
categoryRouter.get('/:categoryId/', getCategory);
categoryRouter.get('/', getAllCategories);
categoryRouter.delete('/:id', auth, deleteCategory);

export default categoryRouter;