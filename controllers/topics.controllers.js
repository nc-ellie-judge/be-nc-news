const {
    selectArticleById,
    selectAllEndpoints,
    selectAllTopics,
    selectAllArticles,
    selectCommentsByArticleId,
    insertNewComment,
    updateArticle
} = require("../models/topics.models.js");

exports.patchArticle = (req, res, next) => {
    const { article_id } = req.params;

    const patch = req.body

    updateArticle(article_id, patch)
        .then((article) => {
            return res.status(200).send({ article })
        })
        .catch((err) => {
            next(err)
        })
}

exports.postNewComment = (req, res, next) => {
    const { article_id } = req.params;

    if (isNaN(Number(article_id))) {
        const err = new Error("400 - Bad Request");
        err.status = 400;
        return next(err);
    } else {
        const newComment = req.body;

        insertNewComment(article_id, newComment)
            .then((comments) => {
                return res.status(201).send({ comment: comments });
            })
            .catch((err) => {
                next(err);
            });
    }
};

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;

    selectCommentsByArticleId(article_id)
        .then((comments) => {
            return res.status(200).send({ comments });
        })
        .catch((err) => {
            next(err);
        });
};

exports.getArticles = (req, res, next) => {
    selectAllArticles()
        .then((articles) => {
            return res.status(200).send({ articles });
        })
        .catch((err) => {
            next(err);
        });
};

exports.getEndpoints = (req, res, next) => {
    selectAllEndpoints()
        .then((endpoints) => {
            return res.status(200).json(endpoints);
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
        const err = new Error("400 - Bad Request");
        err.status = 400;
        return next(err);
    } else {
        selectArticleById(article_id)
            .then((article) => {
                return res.status(200).send({ article });
            })
            .catch((err) => {
                next(err);
            });
    }
};
