const { selectArticleById, selectAllArticles, updateArticle, selectArticlesByTopic, selectAllTopics } = require("../models");

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
    const topic = req.query
    if (topic.topic) {
        // call topic

        selectAllTopics()
            .then((topics) => {
                const validTopics = topics.map((topic) => topic.slug);
                if (!validTopics.includes(topic.topic)) {
                    return Promise.reject({ status: 404, message: "404 - Not Found" })
                }
                else {
                    selectArticlesByTopic(topic)
                        .then((articles) => {
                            return res.status(200).send({ articles });
                        })
                }
            })
            .catch((err) => {
                next(err);
            });
    }
    else {
        selectAllArticles()
            .then((articles) => {
                return res.status(200).send({ articles });
            })
            .catch((err) => {
                next(err);
            });
    }

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
