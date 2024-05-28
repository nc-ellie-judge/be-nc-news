const db = require("../db/connection.js");
const fs = require('fs');
const fsPromises = require('fs').promises;

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