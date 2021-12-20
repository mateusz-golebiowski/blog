import {dataStorageConfig} from '../../config/dataStorageConfig';
import path from 'path';

export const upload = (req, res) => {
    if (req.file !== undefined) {

        res.send({
            'success' : 1,
            'file': {
                'url' : `http://192.168.100.7:4000/api/v1/image/${req.file.filename}`,
            }
        });
    }

};

export const show = (req, res) => {
    let storage;
    if (process.env.NODE_ENV === 'production') {
        storage = process.env.IMAGE_STORAGE;

    } else {
        const resolve = path.resolve;
        storage = resolve(dataStorageConfig.devUploads);
    }

    res.sendFile(`${storage}/${req.params.name}`);
};