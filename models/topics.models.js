const db = require("../db/connection.js");

// think about cacheing -> use cache, clear cache when new topic added
exports.selectAllTopics = () => {
    const queryStr = `SELECT * FROM topics`;
    return db.query(queryStr).then(({ rows }) => rows);
};

