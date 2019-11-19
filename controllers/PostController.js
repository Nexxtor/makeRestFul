var User = require('../models/user');
var Post = require('../models/post');
var debug = require('debug')('blog:post_controller');

module.exports.getOne = (req, res, next) => {
    debug("Search Post", req.params.id);

    Post.findById(req.params.id)
        .then((post) => {
            debug("Found POST", post);
            if (post)
                return res.status(200).json(post);
            else
                return res.status(400).json(null)
        })
        .catch(err => {
            next(err);
        });
}

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

    var filter = {
        state: {
            "$ne": "draft"
        }
    }

    if (!req.listPost) {

        filter = {
            ...filter,
            "$or": [{
                    $text: {
                        $search: req.params.search
                    }
                },
                {
                    "tags": {
                        "$regex": `${req.params.search}`
                    }
                }
            ]
        }
    }

    debug("Filter With", filter);


    Post.find()
        .where(filter)
        .limit(perPage)
        .skip(perPage * page)
        .then((posts) => {
            debug("Count post", posts.length);
            return res.status(200).json(posts)
        }).catch(err => {
            next(err);
        });
}

module.exports.update = (req, res, next) => {
    debug("Post Post", req.params.id);

    let update = {
        ...req.body
    };


    Post.findByIdAndUpdate(req.params.id, update)
        .then((updated) => {
            if (updated)
                return res.status(200).json(updated);
            else
                return res.status(400).json(null);
        }).catch(err => {
            next(err);
        });

}

module.exports.delete = (req, res, next) => {

    debug("Delete Post", req.params.id);

    Post.findByIdAndDelete(req.params.id)
        .then((data) => {
            if (data) res.status(200).json(data);
            else res.status(404).send();
        }).catch(err => {
            next(err);
        })
}