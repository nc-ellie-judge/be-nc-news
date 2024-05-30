const db = require("../db/connection.js");

exports.deleteComment = (comment_id) => {
    const queryStr = `DELETE FROM comments WHERE comment_id = $1 RETURNING *;`

    return db.query(queryStr, [comment_id])
        .then(({ rows }) => {
            console.log(rows);
            if (rows.length === 0) {
                return Promise.reject({ status: 404, message: "404 - Not Found" })
            }
            else {
                return rows[0]
            }
        })
        .catch((err) => {
            return Promise.reject(err)
        })
}

exports.insertNewComment = (article_id, newComment) => {
    const expectedKeys = ["body", "username"];
    const hasAllKeys = expectedKeys.every((key) =>
        newComment.hasOwnProperty(key)
    );

    if (!hasAllKeys) {
        return Promise.reject({ status: 400, message: "400 - Bad Request" });
    } else {
        const values = expectedKeys.map((key) => newComment[key]);
        values.push(Number(article_id));

        return db
            .query(`SELECT * FROM users WHERE username = $1`, [values[1]])
            .then(({ rows }) => {
                if (rows.length === 0) {
                    return Promise.reject({ status: 404, message: "404 - Not Found" });
                }
                return db.query(`SELECT * FROM articles WHERE article_id = $1`, [
                    article_id,
                ]);
            })
            .then(({ rows }) => {
                if (rows.length === 0) {
                    return Promise.reject({ status: 404, message: "404 - Not Found" });
                } else {
                    return db
                        .query(
                            `INSERT INTO comments (body, author, article_id)
                        VALUES ($1, $2, $3) 
                        RETURNING *;`,
                            values
                        )
                        .then((response) => {
                            return response.rows[0];
                        })
                        .catch((err) => {
                            return Promise.reject(err);
                        });
                }
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }
};

exports.selectCommentsByArticleId = (article_id) => {
    const queryStr = `SELECT * FROM comments WHERE comments.article_id = $1 ORDER BY created_at DESC`;

    return db.query(queryStr, [article_id]).then(({ rows }) => {
        return rows;
    });
};