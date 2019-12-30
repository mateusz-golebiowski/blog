import { Post, User } from '../../models';
import Sequelize from 'sequelize';

export const newPost = (req, res) => {
    const data = {
        title: req.body.title,
        content: req.body.content,
        img: req.file.filename,
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

export const updatePost = (req, res) => {
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
                    content: req.body.content,
                    img: req.file.filename,
                };
                user.Posts[0].update(updateData)
                    .then(result =>{

                        const response = {};
                        response.data = result.toJSON();
                        response.success = true;
                        res.send(response);
                    });
            }else {
                res.send('error');
            }
        });
};

export const getPosts = (req, res) => {
    const offset = (req.params.page-1) * 10;
    const limit = offset + 10;
    const Op = Sequelize.Op;

    const titleQuery = req.query.title ? `%${req.query.title}%` : '%';

    Post.count({
        where: {
            title:  {
                [Op.like]: titleQuery
            }
        }
    }).then(count=>{
        Post.findAll({
            where: {
                title:  {
                    [Op.like]: titleQuery
                }
            },
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
                const response = {};
                response.count = count;
                response.pages = Math.ceil(count/(limit-offset));
                response.posts = data;
                res.send(response);
            });
    });

};

export const getPost = (req, res) => {

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

export const deletePost = (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(result => {
            if (result){
                res.send({success:1});
            }else {
                res.send({success:0});
            }
        });

};
