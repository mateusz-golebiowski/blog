import {checkToken} from '../../lib/token';

export const auth = (req, res, next) => {
    checkToken(req.header('authorization'), (result) => {
        if (result.success) {
            console.log(result);
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