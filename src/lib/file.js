import fs from 'fs';
import {dataStorageConfig} from '../config/dataStorageConfig';

export const removeFile = (filename) => {
    let storage;
    if (process.env.NODE_ENV === 'production') {
        storage = process.env.IMAGE_STORAGE;
    } else {
        storage = dataStorageConfig.devUploads;
    }
    try {
        fs.unlinkSync(`${storage}/${filename}`);
    } catch(err) {
        console.error(err);
    }
};