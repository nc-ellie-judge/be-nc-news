const {
    selectArticleById,
    selectAllEndpoints,
    selectAllTopics,
} = require("../models/topics.models.js");

exports.getEndpoints = (req, res, next) => {
    selectAllEndpoints()
        .then((endpoints) => {
            res.status(200).json(endpoints);
        })
        .catch((err) => {
            next(err);
        });
};

exports.getTopics = (req, res, next) => {
    selectAllTopics()
        .then((topics) => {
            return res.status(200).send({ topics });
        })
        .catch((err) => {
            next(err);
        });
};

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;

    selectArticleById(article_id)
        .then((article) => {
            return res.status(200).send({ article });
        })
        .catch((err) => {
            next(err);
        });
};
