const { selectArticleById, selectAllArticles, updateArticle } = require("../models");

exports.patchArticle = (req, res, next) => {
    const { article_id } = req.params;
    const patch = req.body;

    updateArticle(article_id, patch)
        .then((article) => {
            return res.status(200).send({ article });
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
