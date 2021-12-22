import { Router } from 'express';
import {upload, show} from '../controllers/image';
import {auth} from '../controllers/auth';
import multer from 'multer';
import {dataStorageConfig} from '../../config/dataStorageConfig';
import {Request, Response} from "express";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let storage: string;
        if (process.env.NODE_ENV === 'production') {
            storage = process.env.IMAGE_STORAGE || ''; // todo: move to config
        } else {
            storage = dataStorageConfig.devUploads;
        }
        cb(null, storage)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-'+ file.originalname)
    }
});

const fileFilter = (req: Request, file: any, cb: Function) => {
    const type = file.mimetype;
    const typeArray = type.split('/');
    if (typeArray[0] == 'image') {
        cb(null, true);
    }else {
        cb(null, false);
    }
};

const up = multer({ storage: storage, fileFilter: fileFilter });

const imageRouter = Router();
imageRouter.post('/upload', auth, up.single('image'), upload);
imageRouter.get('/:name', show);
export default imageRouter;