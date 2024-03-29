export default class SqlQueries {
    static findUserByUsername(username) {
        return `SELECT * FROM Users WHERE username LIKE "${username}";`
    }

    static findUserById(id) {
        return `SELECT * FROM Users WHERE id LIKE "${id}";`;
    }

    static updateUser(id, data) {
        const fieldsToUpdate = Object.keys(data).map(item => `${item}="${data[item]}"`).join(', ');
        return `UPDATE Users SET ${fieldsToUpdate} WHERE id = ${id};`;
    }

    static findUPostById(id) {
        return `SELECT Post.id, Post.title, Post.img, Post.content, Post.createdAt, Post.updatedAt, Post.Userid,  
        User.id AS 'User.id', User.username AS 'User.username', User.firstname AS 'User.firstname', User.lastname AS 'User.lastname', User.email AS 'User.email'
        FROM Posts AS Post 
        LEFT OUTER JOIN Users AS User ON Post.UserId = User.id 
        WHERE Post.id = '${id}';
`
    }

    static countPosts(searchPhrase) {
        return `SELECT count(*) AS count FROM Posts AS Post WHERE Post.title LIKE '%${searchPhrase}%'`;

    }

    static getPosts(searchPhrase, offset, limit) {
        return ` SELECT Post.id, Post.title, Post.img, Post.content, Post.createdAt, Post.updatedAt, Post.UserId, 
        User.id AS 'User.id', User.username AS 'User.username', User.firstname AS 'User.firstname', User.lastname AS 'User.lastname', 
        User.email AS 'User.email' 
        FROM Posts AS Post 
        LEFT OUTER JOIN Users AS User ON Post.UserId = User.id
        WHERE Post.title LIKE '%${searchPhrase}%' 
        ORDER BY Post.updatedAt DESC LIMIT ${offset}, ${limit};`;

    }

    static deletePostById(id) {
        return `DELETE FROM Posts WHERE id = '${id}'`
    }

    static findPostWithUser(userId, postId) {
        return `SELECT User.id, User.username, User.firstname, User.lastname, User.email, User.password, User.createdAt, User.updatedAt, 
        Posts.id AS 'Posts.id', Posts.img AS 'Posts.img', Posts.content AS 'Posts.content'
        FROM Users AS User INNER JOIN Posts AS Posts ON User.id = Posts.UserId AND Posts.id = ${postId} 
        WHERE User.id = ${userId};`
    }

    static updatePost (data, id) {
        return `UPDATE Posts SET title='${data.title}',content='${data.content}',img='${data.img}' WHERE id = ${id}`
    }

    static insertPost (data) {
        const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        return `INSERT INTO Posts (title, img, content, UserId, createdAt, updatedAt) 
        VALUES ('${data.title}','${data.img}','${data.content}','${data.UserId}', '${date}', '${date}');`
    }
//     static insertComment (data) {
//         const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
//         return `INSERT INTO Comments (content,username,email, postId, createdAt,updatedAt)
//         VALUES ('${data.content}','${data.username}','${data.email}','${data.postId}','${date}','${date}');
// `
//     }

    static deleteCommentById(id) {
        return `DELETE FROM Comments WHERE id = '${id}'`
    }

    static countCommentsForPost(postId) {
        return `SELECT count(*) AS count FROM Comments WHERE postId = ${postId}`;
    }

    static getCommentsByPostId(postId, offset, limit) {
        return `SELECT Comment.id, Comment.content, Comment.username, Comment.email, Comment.createdAt, Comment.updatedAt, Comment.PostId 
        FROM Comments AS Comment 
        WHERE Comment.PostId = '${postId}'
        ORDER BY Comment.updatedAt DESC 
        LIMIT ${offset}, ${limit};`
    }
}
