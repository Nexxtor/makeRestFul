var User = require('../models/user');
var Post = require('../models/post');
var debug = require('debug')('blog:post_controller');

module.exports.create = (req, res, next) => {
    debug("Create Post");
    User.findOne({
            username: req.body.author
        })
        .then(user => {
            if (!user) {
                throw new Error("El autor no existe");
            } else {

                let post = new Post({
                    title: req.body.title,
                    author: user._id,
                    tags: (req.body.tags || "").split(","),
                    state: req.body.state || 'draft',
                    content: req.body.content
                });

                return post.save()
            }
        })
        .then(post => {
            debug(post);
            return res
                .header('Location', '/post/' + post.title)
                .status(201)
                .json({
                    title: post.title,
                    _id: post._id
                });
        })
        .catch(err => {
            next(err)
        });
}

module.exports.find = (req, res, next) => {
    var perPage = Number(req.query.size) || 10,
        page = req.query.page > 0 ? req.query.page : 0;

    debug("Post List", {
        size: perPage,
        page,
        search: req.params.search
    });

    Post.find({
            $text: {
                $search: req.params.search
            }
        })
        .limit(perPage)
        .skip(perPage * page)
        .then((posts) => {
            debug("Found Controllers", posts);
            return res.status(200).json(posts)
        }).catch(err => {
            next(err);
        });
}