import { Router } from 'express';
import { newPost, getPost, getPosts, updatePost, deletePost } from '../controllers/post';
import multer from 'multer';
import {auth} from '../controllers/auth';
import {dataStorageConfig} from '../../config/dataStorageConfig';
import path from 'path';
import crypto from 'crypto';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let storage;
        if (process.env.NODE_ENV === 'production') {
            storage = process.env.IMAGE_STORAGE;
        } else {
            storage = dataStorageConfig.devUploads;
        }
        cb(null, storage)
    },
    filename: function (req, file, cb) {
        const md5sum = crypto.createHash('md5');

        md5sum.update(file.originalname);
        const d = md5sum.digest('hex');
        cb(null, `${Date.now()}${d}.${path.extname(file.originalname)}`)
    }
});

const fileFilter = (req, file, cb) => {
    const type = file.mimetype;
    const typeArray = type.split('/');
    if (typeArray[0] == 'image') {
        cb(null, true);
    }else {
        cb(null, false);
    }
};

const up = multer({ storage: storage, fileFilter: fileFilter });

const postRouter = Router();
postRouter.post('/',auth, up.single('image'), newPost);
postRouter.put('/:id', auth, up.single('image'), updatePost);
postRouter.get('/:page', getPosts);
postRouter.get('/show/:id', getPost);
postRouter.delete('/:id', auth, deletePost);

export default postRouter;