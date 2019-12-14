import { Router } from 'express';
import {upload, show} from '../controllers/image';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-'+ file.originalname)
    }
});

const up = multer({ storage: storage });

const imageRouter = Router();
imageRouter.post('/upload', up.single('image'), upload);
imageRouter.get('/:name', show);
export default imageRouter;