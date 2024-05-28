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

    if (isNaN(Number(article_id))) {
        const err = new Error('400 - Bad Request')
        err.status = 400
        return next(err)
    }
    else {
        selectArticleById(article_id)
            .then((article) => {
                return res.status(200).send({ article });
            })
            .catch((err) => {
                next(err);
            });
    }
};
