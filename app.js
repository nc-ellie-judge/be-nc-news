const express = require('express');
const app = express();
app.use(express.json());
const { getTopics, getEndpoints, getArticleById } = require('./controllers/topics.controllers.js')
const {
    handleCustomErrors,
    handlePsqlErrors,
    handleServerErrors,
    handle404NotFound
} = require('./errors/index.js');

app.get('/api/topics', getTopics)
app.get('/api', getEndpoints)
app.get('/api/articles/:article_id', getArticleById)

app.use(handle404NotFound);
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;