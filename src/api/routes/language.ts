import { Router } from 'express';
import {
 addLanguage, editLanguage, deleteLanguage, getLanguage, getAllLanguages
} from '../controllers/language';
import {auth} from '../controllers/auth';

const languageRouter = Router();
languageRouter.post('/', auth, addLanguage);
languageRouter.put('/:id', auth, editLanguage);
languageRouter.delete('/:id', auth, deleteLanguage);
languageRouter.get('/:id', auth, getLanguage);
languageRouter.get('/', auth, getAllLanguages);
export default languageRouter;