const { log } = require("console");
const db = require("../db/connection.js");
const fsPromises = require('fs').promises;

exports.updateArticle = (article_id, patch) => {

    const validPatches = ["inc_votes"]

    if (!validPatches.includes(Object.keys(patch)[0])) {
        console.log("naughty!");
    }

    const queryStr = `UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2 RETURNING *;`

    return db.query(queryStr, [patch.inc_votes, article_id]).then(({ rows }) => {
        return rows[0]
    })
}

exports.insertNewComment = (article_id, newComment) => {
    const expectedKeys = ["body", "username"];
    const hasAllKeys = expectedKeys.every((key) =>
        newComment.hasOwnProperty(key)
    );

    if (!hasAllKeys) {
        return Promise.reject({ status: 400, message: "400 - Bad Request" });
    }
    else {
        const values = expectedKeys.map((key) => newComment[key]);
        values.push(Number(article_id))

        return db
            .query(`SELECT * FROM users WHERE username = $1`, [values[1]])
            .then(({ rows }) => {
                if (rows.length === 0) {
                    return Promise.reject({ status: 404, message: "404 - Not Found" })
                }
                return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
            })
            .then(({ rows }) => {
                if (rows.length === 0) {
                    return Promise.reject({ status: 404, message: "404 - Not Found" })
                }
                else {
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
            })

    }
}

exports.selectCommentsByArticleId = (article_id) => {
    const queryStr = `SELECT * FROM comments WHERE comments.article_id = $1 ORDER BY created_at DESC`

    return db.query(queryStr, [article_id]).then(({ rows }) => {
        return rows
    })

}

exports.selectAllArticles = () => {
    let queryStr = `SELECT articles.author, articles.title, 
    articles.article_id, articles.topic, articles.created_at, 
    articles.votes, articles.article_img_url,
    COUNT(comments.comment_id) AS comment_count
FROM articles
LEFT JOIN comments ON comments.article_id = articles.article_id
GROUP BY articles.article_id
ORDER BY articles.created_at DESC;`
    return db.query(queryStr).then(({ rows }) => {
        return rows
    })
}

exports.selectAllEndpoints = () => {
    return fsPromises.readFile('./endpoints.json', 'utf-8')
        .then((endpoints) => {
            const parsedEndpoints = JSON.parse(endpoints);
            return { endpoints: parsedEndpoints };
        })
}

exports.selectAllTopics = () => {
    const queryStr = `SELECT * FROM topics`;
    return db.query(queryStr).then(({ rows }) => rows);
};

exports.selectArticleById = (article_id) => {
    const queryStr = `SELECT * FROM articles WHERE articles.article_id = $1`
    return db.query(queryStr, [article_id]).then(({ rows }) => {

        if (rows.length === 0) {
            return Promise.reject({ status: 404, message: "404 - Not Found" })
        }
        else {
            return rows[0]
        }
    })
}