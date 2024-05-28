const db = require("../db/connection.js");


exports.selectAllTopics = () => {
    const queryStr = `SELECT *
    FROM topics`;

    return db.query(queryStr).then(({ rows }) => rows);
};