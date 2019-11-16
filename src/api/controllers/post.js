import {checkToken} from  '../../lib/token';
import { Post, User } from '../../models';
import Sequelize from "sequelize";

export const newPost = (req, res, next) => {
    console.log(req.body);
    checkToken(req.body.auth, (user) => {
        if (user.success) {
            const data = {
                title: req.body.title,
                content: req.body.content
            };
            console.log(user);
            Post.create(data)
                .then(result=> {
                    result.setUser(user.decoded.id);
                    res.send(result);
                });
        } else {
            res.send({error: "Wrong token"});
        }
    });


};

export const updatePost = (req, res, next) => {

};

export const getPosts = (req, res, next) => {
    const offset = (req.params.page-1) * 10;
    const limit = offset + 10;

    Post.findAll({
        offset,
        limit,
        order: [['updatedAt', 'DESC']],
        include: [{
            model: User,
            attributes: ['id','firstname','lastname','email']
        }]
    })
        .then(posts => {

            const data =  posts.map( post => post.toJSON());
            //const data = posts ? posts.dataValues : { error: "there is no posts"};
            res.send(data);
    });
};

export const getPost = (req, res, next) => {

    Post.findOne({
        where: {
            id: req.params.id
        },
        include: [{model: User,attributes: ['id','firstname','lastname','email']}]
    })
        .then(post => {

            const data = post ? post.dataValues : { error: "there is no post"};
            res.send(data);
        });
};
export const deletePost = (req, res, next) => {

};
