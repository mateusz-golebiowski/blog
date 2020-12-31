export default class SqlQueries {
    static findUserByUsername (username) {
        return `SELECT * FROM Users WHERE username LIKE "${username}";`
    }
    static findUserById (id) {
        return `SELECT * FROM Users WHERE id LIKE "${id}";`;
    }
    static updateUser (id, data) {
        const fieldsToUpdate = Object.keys(data).map(item=> `${item}="${data[item]}"`).join(', ');
        return `UPDATE Users SET ${fieldsToUpdate} WHERE id = ${id};`;
    }
}