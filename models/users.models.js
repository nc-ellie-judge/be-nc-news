const db = require("../db/connection.js");

exports.selectAllUsers = () => {
    const queryStr = `SELECT users.username, users.name, users.avatar_url FROM users;`

    return db.query(queryStr)
        .then(({ rows }) => {
            return rows
        })
        .catch((err) => {
            return Promise.reject(err)
        })
}
