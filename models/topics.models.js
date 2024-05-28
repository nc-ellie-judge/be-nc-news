const db = require("../db/connection.js");
const fs = require('fs');
const fsPromises = require('fs').promises;

exports.selectAllEndpoints = () => {
    return fsPromises.readFile('./endpoints.json', 'utf-8')
        .then((endpoints) => {
            const parsedEndpoints = JSON.parse(endpoints);
            return { endpoints: parsedEndpoints };
        })
        .catch((err) => {
            next(err)
        })
}

exports.selectAllTopics = () => {
    const queryStr = `SELECT * FROM topics`;
    return db.query(queryStr).then(({ rows }) => rows);
};

exports.selectArticleById = (article_id) => {
    const queryStr = `SELECT * FROM articles WHERE articles.article_id = $1`
    return db.query(queryStr, [article_id]).then(({ rows }) => rows[0])
}