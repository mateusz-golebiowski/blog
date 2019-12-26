import {checkToken, createToken} from  '../../lib/token';
import { User } from '../../models';
import Sequelize from "sequelize";

const alloweFileTypes = [
    'image/png',
    'image/jpeg',
];

export const upload = (req, res) => {
    if (req.file !== undefined) {

        res.send({
            'success' : 1,
            'file': {
                'url' : `http://192.168.100.7:4000/api/v1/image/${req.file.filename}`,
                // ... and any additional fields you want to store, such as width, height, color, extension, etc
            }
        });
    }

};

export const show = (req, res) => {
    res.sendFile(`/home/mateusz/WebstormProjects/blog/uploads/${req.params.name}`);
};