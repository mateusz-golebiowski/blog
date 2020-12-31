import {checkToken, createToken} from  '../../lib/token';
import { User } from '../../models';
import Sequelize from "sequelize";
import errors from '../../lib/errors';
import db from '../../models/index';
import SqlQueries from "../../lib/sqlQueries";

const validateData = (data)  => {
    // TODO: add data validation
    return true;
};

export const signIn = (req, res) => {
    const data = {
        username: req.body.username,
        password: req.body.password
    };

    db.sequelize.query(SqlQueries.findUserByUsername(data.username), {
        model: User,
        mapToModel: true
    })
        .then(async result => {
        if (result.length === 0) {
            res.status(401).send({ auth: false, message: 'user not found' });
        } else if (!await result[0].validPassword(data.password)) {
            res.status(401).send({ auth: false, message: 'wrong password' });
        } else {
            const token = createToken(result[0].dataValues.id);

            res.status(200).send({ auth: true, token: token });
        }

    });
};

export const signUp = (req, res) => {
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

export const updateUserData = (req, res) => {
    console.log(req.user.decoded.id);
    const data = {};
    if (req.body.username !== undefined)
        data.username = req.body.username;
    if (req.body.email !== undefined)
        data.email = req.body.email;
    if (req.body.lastname !== undefined)
        data.lastname = req.body.lastname;
    if (req.body.firstname !== undefined)
        data.firstname = req.body.firstname;

    if(req.body.oldPassword && req.body.newPassword) {
        data.password = req.body.newPassword;
    }
    db.sequelize.query(SqlQueries.findUserById(req.user.decoded.id), {
        model: User,
        mapToModel: true
    })
        .then(async result => {
            if (result.length === 0) {
                return res.status(401).send({ success: 0, message: 'user not found' });
            } else  {
                if(req.body.oldPassword && req.body.newPassword) {
                    if (!await result[0].validPassword(req.body.oldPassword)) {
                        return res.status(401).send({ success: 0, message: 'wrong password', fields:[{fieldname: 'oldPassword', type: 'wrong password'}] });
                    }
                }
                db.sequelize.query(SqlQueries.updateUser(req.user.decoded.id, data), {
                    type: Sequelize.QueryTypes.UPDATE
                })
                    .then(async updated=>{
                        const updatedUser = await db.sequelize.query(SqlQueries.findUserById(req.user.decoded.id), {
                            model: User,
                            mapToModel: true
                        })
                        const upd = updatedUser[0].toJSON();
                        const data = {
                            username: upd.username,
                            email: upd.email,
                            firstname: upd.firstname,
                            lastname: upd.lastname,
                        };
                        return res.status(200).send({success: 1, data: data });
                    })
                    .catch( error => {
                        const errors = error.errors;
                        const incorrectFields = [];
                        errors.forEach( item => {
                            incorrectFields.push({
                                fieldName: item.path,
                                type: item.type,
                            });
                        });

                        return res.status(401).send({ success: 0, message: error.message, fields: incorrectFields});
                    });

            }
        });

};

export const getUserData = (req, res) => {
    db.sequelize.query(SqlQueries.findUserById(req.user.decoded.id), {
        model: User,
        mapToModel: true
    })
        .then(result => {
            const user = result[0].toJSON()
            res.send({success: 1, data: {
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email
            }});
        })

};
