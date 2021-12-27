import {checkToken} from '../../lib/token';
import {Request, Response} from "express";

export const auth = (req: Request, res: Response, next: Function) => {
    checkToken(req.header('authorization'), (result: any) => {
        if (result.success) {
            //@ts-ignore
            req.user = result;
            next();
        } else {
            res.status(403).send({
                'success' : 0,
                'msg': 'Not authorized'
            });
        }
    });
};