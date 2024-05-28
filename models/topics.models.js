const db = require("../db/connection.js");
const fs = require('fs');
const fsPromises = require('fs').promises;

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