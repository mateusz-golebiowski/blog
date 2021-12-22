import {dataStorageConfig} from '../../config/dataStorageConfig';
import path from 'path';
import {Request, Response} from "express";

export const upload = (req: Request, res: Response) => {
    if (req.file !== undefined) {

        res.send({
            'success' : 1,
            'file': {
                'url' : `http://192.168.100.7:4000/api/v1/image/${req.file.filename}`, // todo: remove hardocded address
            }
        });
    }

};

export const show = (req: Request, res: Response) => {
    let storage;
    if (process.env.NODE_ENV === 'production') {
        storage = process.env.IMAGE_STORAGE;

    } else {
        const resolve = path.resolve;
        storage = resolve(dataStorageConfig.devUploads);
    }

    res.sendFile(`${storage}/${req.params.name}`);
};