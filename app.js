const express = require("express");
const app = express();
app.use(express.json());
const { getCommentsByArticleId, postNewComment, getArticleById, getArticles, patchArticle, getEndpoints, getTopics, deleteCommentByCommentId, getUsers } = require("./controllers");
const { handleCustomErrors, handlePsqlErrors, handleServerErrors, handle404NotFound, } = require("./errors/index.js");
const cors = require('cors');

app.use(cors());
app.get("/api/topics", getTopics);
app.get("/api", getEndpoints);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postNewComment);
app.patch("/api/articles/:article_id", patchArticle);
app.delete("/api/comments/:comment_id", deleteCommentByCommentId);
app.get("/api/users", getUsers);

app.use(handle404NotFound);
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
