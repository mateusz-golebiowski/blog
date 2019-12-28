import {checkToken, createToken} from  '../../lib/token';
import { User } from '../../models';
import Sequelize from "sequelize";


const validateData = (data)  => {
    // TODO: add data validation
    return true;
};

export const signIn = (req, res) => {
    const data = {
        username: req.body.username,
        password: req.body.password
    };

    User.findOne({
        where: {
            username: data.username
        }
    }).then(async result => {
        if (!result) {

            res.status(401).send({ auth: false, message: 'user not found' });
        } else if (!await result.validPassword(data.password)) {

            res.status(401).send({ auth: false, message: 'wrong password' });
        } else {
            const token = createToken(result.dataValues.id);

            res.status(200).send({ auth: true, token: token });
        }

    });
};

export const signUp = (req, res) => {
    const data = {
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
    }

};

export const updateUserData = (req, res) => {
    console.log(req.body);

    res.send({ok:1});
};

export const getUserData = (req, res) => {
    User.findByPk(req.params.id, {
        attributes: ['username', 'firstname', 'lastname', 'email'],
    }).then(result => {
        res.send({success: 1, data: result.toJSON()});
    });
};
