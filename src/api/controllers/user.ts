import {checkToken, createToken} from  '../../lib/token';
import errors from '../../lib/errors';
import SqlQueries from "../../lib/sqlQueries";
import bcrypt from "bcrypt";
import {getConnection, getConnectionManager, getRepository} from "typeorm";
import {Request, Response} from "express";
import {User} from "../../Enitites/user";
import DatabaseManager from "../../lib/DatabaseManager";
import {Role} from "../../Enitites/role";

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
    console.log(data)
    const user: User[] = await userRep.find({
        relations: ['role'],
        where: {email: data.email}
    })
    console.log(user)
    console.log( await validPassword(user[0].password, data.password))
    if (user.length === 0) {
        res.status(401).send({ auth: false, message: 'user not found' });
    } else if (! await validPassword(user[0].password, data.password)) {
        res.status(401).send({ auth: false, message: 'wrong password' });
    } else {
        const token = createToken(user[0].id, user[0].role);

        res.status(200).send({ auth: true, token: token });
    }
};

export const inviteUser = async (req: Request, res: Response) => {
    const connection = DatabaseManager.getInstance().getConnection();
    const roleRep = connection.getRepository(Role);
    const roles = await roleRep.find({
        where: {id: req.body.role}
    })
    const userRep = await connection.getRepository(User);
    const newUser = new User();
    newUser.firstName = req.body.firstName;
    newUser.lastName = req.body.lastName;
    newUser.email = req.body.email;
    newUser.role = roles[0];
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('zaq12wsx', salt); // todo: password
    newUser.password = hash;
    console.log(newUser)
    const result = await userRep.save(newUser);

    //todo : email send, validate data
    if (result) {
        res.status(200).send({});
    } else {
        res.status(409).send({ message: 'incorrect data' });

    }


};

export const updateUserData = async (req: Request, res: Response) => {
    // @ts-ignore
    console.log(req.user.decoded.id);
    const connection = DatabaseManager.getInstance().getConnection();
    const userRep = connection.getRepository(User);
    const user: User[] = await userRep.find({
        // @ts-ignore
        where: {id: req.user.decoded.id}
    })

    console.log(user)
    // @ts-ignore
    if (user.length === 0) {
        return res.status(401).send({ success: 0, message: 'user not found' });
    } else {
        if (req.body.email !== undefined)
            user[0].email = req.body.email;
        if (req.body.lastName !== undefined)
            user[0].lastName = req.body.lastName;
        if (req.body.firstName !== undefined)
            user[0].firstName = req.body.firstName;
        if(req.body.oldPassword && req.body.newPassword) {
            if (!await validPassword(user[0].password, req.body.oldPassword)) {
                return res.status(401).send({ success: 0, message: 'wrong password', fields:[{fieldname: 'oldPassword', type: 'wrong password'}] });
            }
        }
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

export const getUserData = async (req: Request, res: Response) => {
    const connection = DatabaseManager.getInstance().getConnection();
    const userRep = connection.getRepository(User);
    const user = await userRep.find({
        // @ts-ignore
        where: { id: req.user.decoded.id}
    })
    res.send({
        success: 1,
        data: user[0]
    })
};
export const getAllUserData = async (req: Request, res: Response) => {
    const connection = DatabaseManager.getInstance().getConnection();
    const userRep = connection.getRepository(User);
    const users = await userRep.find({
        relations: ['role'],
    })
    const result = users.map(item => ({
        ...item,
        password: undefined
    }))
    console.log(result)

    res.status(200)
    res.send(result)
};

export const updateUserDataByAdmin = async (req: Request, res: Response) => {
    // @ts-ignore
    console.log(req.user.decoded.id);
    const id = Number.parseInt(req.params.id);
    const connection = DatabaseManager.getInstance().getConnection();
    const userRep = connection.getRepository(User);
    const user: User[] = await userRep.find({
        // @ts-ignore
        where: {id: id}
    })

    console.log(user)
    // @ts-ignore
    if (user.length === 0) {
        return res.status(401).send({ success: 0, message: 'user not found' });
    } else {
        if (req.body.email !== undefined)
            user[0].email = req.body.email;
        if (req.body.lastName !== undefined)
            user[0].lastName = req.body.lastName;
        if (req.body.firstName !== undefined)
            user[0].firstName = req.body.firstName;
        //todo: role
        
        // if(req.body.oldPassword && req.body.newPassword) {
        //     if (!await validPassword(user[0].password, req.body.oldPassword)) {
        //         return res.status(401).send({ success: 0, message: 'wrong password', fields:[{fieldname: 'oldPassword', type: 'wrong password'}] });
        //     }
        // }
        // if (req.body.oldPassword && req.body.newPassword) {
        //     if (!await validPassword(user[0].password, req.body.oldPassword)) {
        //         return res.status(401).send({
        //             success: 0,
        //             message: 'wrong password',
        //             fields: [{fieldname: 'oldPassword', type: 'wrong password'}]
        //         });
        //     }
        //     const password = await bcrypt.hash(req.body.newPassword, 10);
        //     user[0].password = password;
        //
        // }
        const result = await userRep.save(user[0]);
        const data = {
            email: result.email,
            firstname: result.firstName,
            lastname: result.lastName,
        };
        return res.status(200).send({success: 1, data: data});
    }

};
