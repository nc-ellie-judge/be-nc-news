const express = require('express');
const app = express();
app.use(express.json());
const { getTopics, getEndpoints } = require('./controllers/topics.controllers.js')

app.get('/api/topics', getTopics)
app.get('/api', getEndpoints)

app.use((req, res, next) => {
    const err = new Error('404 - Not Found');
    err.status = 404;
    next(err);
})

app.use((err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ message: err.message });
    } else {
        res.status(500).send({ message: 'Internal Server Error' });
    }
})


module.exports = app;