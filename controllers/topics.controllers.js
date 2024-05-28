const { selectAllTopics } = require('../models/topics.models.js')


exports.getTopics = (req, res, next) => {
    selectAllTopics().then((topics) => {
        return res.status(200).send({ topics })
    })
        .catch((err) => {
            next(err)
        })
}