import {checkToken, createToken} from  '../../lib/token';
import errors from '../../lib/errors';
import SqlQueries from "../../lib/sqlQueries";
import bcrypt from "bcrypt";
import {getConnection, getConnectionManager, getRepository} from "typeorm";
import {Request, Response} from "express";
import {User} from "../../Enitites/user";
import DatabaseManager from "../../lib/DatabaseManager";

const validateData = (data: Object)  => {
    // TODO: add data validation
    return true;
};
const validPassword = (dbPassword: string, password: string) => {
    return bcrypt.compare(password, dbPassword);
};
export const signIn = async (req: Request, res: Response) => {
    const data = {
        email: req.body.email, //todo: change username to emial on frontend
        password: req.body.password
    };
    const connection = DatabaseManager.getInstance().getConnection();

    const userRep = await connection.getRepository(User);
    const user: User[] = await userRep.find({
        where: {email: data.email}
    })
    if (user.length === 0) {
        res.status(401).send({ auth: false, message: 'user not found' });
    } else if (! await validPassword(user[0].password, data.password)) {
        res.status(401).send({ auth: false, message: 'wrong password' });
    } else {
        const token = createToken(user[0].id);

        res.status(200).send({ auth: true, token: token });
    }
};

export const signUp = (req: Request, res: Response) => {
    /*const data = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    };


    if (validateData(data)) {
        User.findAll({
            attributes: ['username', 'email'],
            where: {
                [Sequelize.Op.or]: [{username: data.username}, {email: data.email}]
            }
        })
            .then(result => {
                if (result.length === 0) {

                    return User.create(data);
                } else {
                    return null;
                }
            })
            .then(user => {
                if (user) {
                    const token = createToken(user.dataValues.id);

                    return res.status(200).send({auth: true, token: token});
                } else {

                    return res.status(409).send({ message: 'user exists' });
                }
            });
    } else {
        return res.status(409).send({ message: 'incorrect data' });
    }*/
    return res.status(409).send({ message: 'incorrect data' });

};

export const updateUserData = async (req: Request, res: Response) => {
    // @ts-ignore
    console.log(req.user.decoded.id);
    const data: any = {};
    const connection = DatabaseManager.getInstance().getConnection();
    const userRep = connection.getRepository(User);
    const user: User[] = await userRep.find({
        // @ts-ignore
        where: {id: req.user.decoded.id}
    })
    if (req.body.email !== undefined)
        user[0].email = req.body.email;
    if (req.body.lastname !== undefined)
        user[0].lastName = req.body.lastname;
    if (req.body.firstname !== undefined)
        user[0].firstName = req.body.firstname;
    if(req.body.oldPassword && req.body.newPassword) {
        if (!await validPassword(user[0].password, req.body.oldPassword)) {
            return res.status(401).send({ success: 0, message: 'wrong password', fields:[{fieldname: 'oldPassword', type: 'wrong password'}] });
        }
    }
    // @ts-ignore
    if (result.length === 0) {
        return res.status(401).send({ success: 0, message: 'user not found' });
    } else {
        if (req.body.oldPassword && req.body.newPassword) {
            if (!await validPassword(user[0].password, req.body.oldPassword)) {
                return res.status(401).send({
                    success: 0,
                    message: 'wrong password',
                    fields: [{fieldname: 'oldPassword', type: 'wrong password'}]
                });
            }
            const password = await bcrypt.hash(req.body.newPassword, 10);
            user[0].password = password;

        }
        const result = await userRep.save(user[0]);
        const data = {
            email: result.email,
            firstname: result.firstName,
            lastname: result.lastName,
        };
        return res.status(200).send({success: 1, data: data});
    }

};

export const getUserData = (req: Request, res: Response) => {
    console.log('test')

    // db.sequelize.query(SqlQueries.findUserById(req.user.decoded.id), {
    //     model: User,
    //     mapToModel: true
    // })
    //     .then(result => {
    //         const user = result[0].toJSON()
    //         res.send({success: 1, data: {
    //             username: user.username,
    //             firstname: user.firstname,
    //             lastname: user.lastname,
    //             email: user.email
    //         }});
    //     })

};
