var User = require('../models/user');
var debug = require('debug')('blog:user_controller');

// Search a one user y database
module.exports.searchOne = (req, res, next) => {
    debug("Search User");
    User.findOne({
            username: req.params.username
        }, "-password -login_count")
        .then((foundUser) => {
            if (foundUser)
                return res.status(200).json(foundUser);
            else
                return res.status(400).json(null)
        })
        .catch(err => {
            debug(err);
        });
}