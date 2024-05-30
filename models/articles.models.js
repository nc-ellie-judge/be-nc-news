const db = require("../db/connection.js");

exports.selectArticleById = (article_id) => {
    const queryStr = `SELECT * FROM articles WHERE articles.article_id = $1`;
    return db.query(queryStr, [article_id]).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, message: "404 - Not Found" });
        } else {
            return rows[0];
        }
    });
};

exports.updateArticle = (article_id, patch) => {
    const validPatches = ["inc_votes"];

    if (!validPatches.includes(Object.keys(patch)[0])) {
        return Promise.reject({ status: 400, message: "400 - Bad Request" });
    }

    return db
        .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, message: "404 - Not Found" });
            } else {
                const queryStr = `UPDATE articles
                SET votes = votes + $1
                WHERE article_id = $2 RETURNING *;`;

                return db
                    .query(queryStr, [patch.inc_votes, article_id])
                    .then(({ rows }) => {
                        return rows[0];
                    });
            }
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};


// todo: split out selectAllArticles and selectArticlesByTopic

// todo: create a getValidTopics function (perhaps in topics model) ✅

// topic -> 

exports.selectArticlesByTopic = ({ topic }) => {
    const query = `SELECT articles.author, articles.title, 
    articles.article_id, articles.topic, articles.created_at, 
    articles.votes, articles.article_img_url,
    COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id 
    WHERE topic=$1
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`


    if (topic) {
        return db.query(query, [topic]).then(({ rows }) => {
            return rows;
        });
    }

}

exports.selectAllArticles = () => {

    // call select all topics and check topic exists in here
    const query = `SELECT articles.author, articles.title, 
    articles.article_id, articles.topic, articles.created_at, 
    articles.votes, articles.article_img_url,
    COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id 
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`

    return db.query(query).then(({ rows }) => {
        return rows;
    });

};