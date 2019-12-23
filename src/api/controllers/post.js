import {checkToken} from  '../../lib/token';
import { Post, User } from '../../models';
import Sequelize from "sequelize";

export const newPost = (req, res, next) => {
    const data = {
        title: req.body.title,
        content: req.body.content,
        img: `http://127.0.0.1:4000/api/v1/image/${req.file.filename}`,
    };
    console.log(req.user);
    Post.create(data)
        .then(result=> {
            result.setUser(req.user.decoded.id);
            const response = {};
            response.data = result.toJSON();
            response.success = true;
            res.send(response);
        });
};

export const updatePost = (req, res, next) => {
    const postId = parseInt(req.params.id);
    User.findOne({
        where: {
            id: req.user.decoded.id
        },
        include: [{
            model: Post,
            attributes: ['id'],
            where: {
                id: postId
            }
        }]
    })
        .then(user => {
            if (user !== null) {
                const updateData = {
                    title: req.body.title,
                    content: req.body.content
                };
                user.Posts[0].update(updateData)
                    .then(result =>{
                        res.send(result.toJSON());
                    });
            }else {
                res.send("error");
            }
        });
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
            attributes: ['id','username','firstname','lastname','email']
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
        include: [{model: User,attributes: ['id','username','firstname','lastname','email']}]
    })
        .then(post => {
            let response;
            if (post) {
                response = post.dataValues;
                response.success = 1;
            } else {
                response = { success: 0, error: 'there is no post'}
            }
            res.send(response);
        });
};
export const deletePost = (req, res, next) => {

};
