const { selectCommentsByArticleId, insertNewComment, deleteComment } = require("../models");

exports.deleteCommentByCommentId = (req, res, next) => {
    const { comment_id } = req.params;

    deleteComment(comment_id)
        .then(() => {
            return res.status(204).send()
        })
        .catch((err) => {
            return next(err)
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
                return next(err);
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