import db, {Comment, Post} from '../../models';
import SqlQueries from "../../lib/sqlQueries";

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
        content: req.body.content,
        postId: req.params.postId
    };

    if (validateData(data)){
        const opts = {
            raw: true,
        }
        db.sequelize.query(SqlQueries.insertComment(data), opts)
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

export const deleteComment = (req, res) => {
    const opts = {
        raw: true,
    }
    db.sequelize.query(SqlQueries.deleteCommentById(req.params.id), opts) .then(result => {
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
    const opts = {
        raw: true,
    }
    db.sequelize.query(SqlQueries.countCommentsForPost(postId), opts).then(count => {
        return count[0][0].count
    })
        .then(count => {
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
            const opts = {
                model: Comment,
                mapToModel: true,
                nest: true,
                raw: true,
            }
            db.sequelize.query(SqlQueries.getCommentsByPostId(postId, offset, limit), opts)
                .then(result=>{
                    const response = {};
                    response.count = count;
                    response.pages = Math.ceil(count/(limit-offset));
                    response.comments = result;
                    res.send(response);
                })
        })

};
