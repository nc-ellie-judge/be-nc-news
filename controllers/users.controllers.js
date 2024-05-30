const { selectAllUsers } = require('../models/')

exports.getUsers = (req, res, next) => {
    selectAllUsers()
        .then((data) => {
            return res.status(200).send({ users: data })
        })
        .catch((err) => {
            return next(err)
        })
}