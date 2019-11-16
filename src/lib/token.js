import jsonwebtoken from 'jsonwebtoken';
import {webtokenConfig} from '../config/webtoken';

export const checkToken = (token, next) => {
    if (token) {
        jsonwebtoken.verify(token, webtokenConfig.secret, (err, decoded) => {
            if (err) {
                next({
                    success: false,
                    message: 'Token is not valid'
                });
            } else {
                next({
                    success: true,
                    decoded: decoded
                });
            }
        });
    } else {
        next({
            success: false,
            message: 'Auth token is not supplied'
        });
    }
};
export const createToken = (id) =>{
    return jsonwebtoken.sign({ id: id }, webtokenConfig.secret, {
        expiresIn: 86400 // expires in 24 hours
    });
};