const db = require("../db/connection.js");
const { selectAllTopics } = require("./topics.models.js");

exports.selectArticleById = (article_id) => {
    const query = `SELECT articles.author, articles.title, 
    articles.article_id, articles.topic, articles.created_at, articles.body,
    articles.votes, articles.article_img_url,
    COUNT(comments.comment_id)::integer AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id 
    WHERE articles.article_id=$1
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`

    return db.query(query, [article_id]).then(({ rows }) => {
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

exports.selectArticles = ({ topic, sort_by = 'created_at', order = 'DESC' }) => {
    const validSortColumns = ['author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'article_img_url'];
    const validOrderDirections = ['ASC', 'DESC'];

    if (!validSortColumns.includes(sort_by)) {
        return Promise.reject({ status: 400, message: '400 - Bad Request' })
    }

    if (!validOrderDirections.includes(order.toUpperCase())) {
        return Promise.reject({ status: 400, message: '400 - Bad Request' })
    }

    let query = `SELECT articles.author, articles.title, 
    articles.article_id, articles.topic, articles.created_at, 
    articles.votes, articles.article_img_url,
    COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id`;

    const queryParams = [];

    if (topic) {
        return selectAllTopics()
            .then((topics) => {
                const validTopics = topics.map((topic) => topic.slug);
                if (!validTopics.includes(topic)) {
                    return Promise.reject({ status: 404, message: "404 - Not Found" });
                }

                query += ` WHERE topic=$1`;
                queryParams.push(topic);

                query += ` GROUP BY articles.article_id
                ORDER BY ${sort_by} ${order};`;

                return db.query(query, queryParams);
            })
            .then(({ rows }) => {
                return rows;
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    } else {
        query += ` GROUP BY articles.article_id
        ORDER BY ${sort_by} ${order};`;

        return db.query(query, queryParams).then(({ rows }) => {
            return rows;
        });
    }
};
