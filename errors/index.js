exports.handle404NotFound = (req, res, next) => {
    res.status(404).send({ message: '404 - Not Found' });
}

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.message) {
        res.status(err.status).send({ message: err.message });
    } else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ message: '400 - Invalid Input' });
    } else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send({ message: 'Internal Server Error' });
};