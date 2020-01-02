import {Comment, Post} from '../../models';

const validateData = (data) => {
    let correct = true;
    try {
        if (data.email.length === 0 || data.content.length === 0 || data.username.length === 0)
            correct = false;
    } catch (e) {
        correct = false;
    }
    return correct;
};

export const newComment = (req, res) => {
    console.log(req.body);
    const data = {
        username: req.body.username,
        email: req.body.email,
        content: req.body.content
    };

    if (validateData(data)){
        Comment.create(data)
            .then(result=> {
                result.setPost(req.params.postId);
                const response = {};
                response.data = result.toJSON();
                response.success = true;
                res.send(response);
            });
    }else {
        const response = { success: 0, error: 'wrong data'};
        res.send(response);
    }
};

export const deleteComment = (req, res) => {
    Comment.destroy({
        where: {
            id:  req.params.id
        }
    }).then(result => {
        if (result){
            res.send({success:1});
        }else {
            res.send({success:0});
        }
    });
};

export const getComments = (req, res) => {
    const offset = (req.params.page-1) * 10;
    const limit = offset + 10;
    const postId = req.params.postId;

    Comment.findAll({
        offset,
        limit,
        order: [['updatedAt', 'DESC']],
        include: [{
            model: Post,
            attributes: [],
            where: {
                id: postId
            }
        }]
    })
        .then(result=>{
            res.send(result);
        })
};
