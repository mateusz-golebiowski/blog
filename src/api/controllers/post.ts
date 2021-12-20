import db, { Post, User, Comment } from '../../models';
import Sequelize from 'sequelize';
import {removeFile} from '../../lib/file';
import SqlQueries from "../../lib/sqlQueries";

const prepareFileList = (content) => {
    return content.blocks.reduce((filtered, item)=>{
        if (item.type === 'image') {
            const filename = item.data.file.url.substring(item.data.file.url.lastIndexOf('/')+1);
            filtered.push(filename);
        }
        return filtered;
    }, []);
};
const validateData = (data) => {
    let correct = true;
    if(data.title.length === 0 || data.content.length === 0 || data.img.length === 0)
        correct = false;
    const content = JSON.parse(data.content);
    console.log(content);
    if (!Array.isArray(content.blocks))
        correct = false;
    return correct;
};

export const newPost = (req, res) => {
    const data = {
        title: req.body.title,
        content: req.body.content,
        img: req.file.filename,
        UserId: req.user.decoded.id
    };

    if (validateData(data)){
        const opts = {
            raw: true,
        }
        db.sequelize.query(SqlQueries.insertPost(data), opts)
            .then(result=> {
                const response = {};
                response.data = {
                    ...data,
                    id: result[0]
                };
                response.success = true;
                res.send(response);
            });
    }else {
       const response = { success: 0, error: 'wrong data'};
       res.send(response);
    }
};

export const updatePost = (req, res) => {
    const opts = {
        model: User,
        mapToModel: true,
        nest: true,
        raw: true,
        include: [
            {
                model: Post,
                attributes: ['id', 'img', 'content'],
            },
        ]
    }
    const postId = parseInt(req.params.id);

    db.sequelize.query(SqlQueries.findPostWithUser(req.user.decoded.id, postId), opts)
        .then(user => {
            if (user.length === 1) {
                const updateData = {
                    title: req.body.title,
                    content: req.body.content,
                    img: req.file.filename,
                };
                if (validateData(updateData)){
                    const oldContent = JSON.parse(user[0].Posts.content);
                    const oldImages = prepareFileList(oldContent);
                    const newContent = JSON.parse(updateData.content);
                    const newImages = prepareFileList(newContent);
                    const imagesToRemove = oldImages.filter( ( el ) => !newImages.includes( el ) );

                    imagesToRemove.push(user[0].Posts.img);
                    imagesToRemove.forEach( item=>{
                        removeFile(item);
                    });

                    const optsUpdate = {
                        raw: true,
                    }
                    db.sequelize.query(SqlQueries.updatePost(updateData, postId), optsUpdate)
                        .then(result=> {
                            const response = {};
                            response.data = {
                                ...updateData,
                                id: postId
                            };
                            response.success = true;
                            res.send(response);
                        })
                    // user.Posts[0].update(updateData)
                    //     .then(result =>{
                    //
                    //         const response = {};
                    //         response.data = result.toJSON();
                    //         response.success = true;
                    //         res.send(response);
                    //     });


                } else {
                    const response = { success: 0, error: 'wrong data'};
                    res.send(response);
                }

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
    const opts = {
        raw: true,
    }
    db.sequelize.query(SqlQueries.countPosts(titleQuery), opts).then(count => {
        return count[0][0].count
    }).then(count=>{
        const opts = {
            model: Post,
            mapToModel: true,
            nest: true,
            raw: true,
        }
        db.sequelize.query(SqlQueries.getPosts(titleQuery, offset, limit), opts)
            .then(posts => {
                const response = {};
                response.count = count;
                response.pages = Math.ceil(count/(limit-offset));
                response.posts = posts;
                res.send(response);
            });
    });

};

export const getPost = (req, res) => {
    const opts = {
        model: Post,
        mapToModel: true,
        nest: true,
        raw: true,
        include: [
            {
                model: User,
                attributes: ['id','username','firstname','lastname','email']
            },
        ]
    }
    db.sequelize.query(SqlQueries.findUPostById(req.params.id), opts).then(post => {
        let response;
        if (post.length === 1) {
            response = post[0];
            response.success = 1;
        } else {
            response = { success: 0, error: 'there is no post'}
        }
        res.send(response);
    })
};

export const deletePost = (req, res) => {

    const opts = {
        model: Post,
        mapToModel: true,
        nest: true,
        raw: true,
        include: [
            {
                model: User,
                attributes: ['id','username','firstname','lastname','email']
            },
        ]
    }
    db.sequelize.query(SqlQueries.findUPostById(req.params.id), opts)
        .then(result => {
            const content = JSON.parse(result[0].content);
            const imagesToRemove = prepareFileList(content);
            imagesToRemove.push(result[0].img);
            imagesToRemove.forEach( item=>{
               removeFile(item);
            });

        })
        .then(()=>{
            const opts = {
                raw: true,
            }
            db.sequelize.query(SqlQueries.deletePostById(req.params.id), opts) .then(result => {
                    if (result){
                        res.send({success:1});
                    }else {
                        res.send({success:0});
                    }
                });
        });
};
