const { selectAllEndpoints } = require("../models/");

exports.getEndpoints = (req, res, next) => {
    selectAllEndpoints()
        .then((endpoints) => {
            return res.status(200).json(endpoints);
        })
        .catch((err) => {
            next(err);
        });
};