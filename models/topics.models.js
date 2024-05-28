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
    const queryStr = `SELECT *
    FROM topics`;

    return db.query(queryStr).then(({ rows }) => rows);
};