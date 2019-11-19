var express = require('express');
var router = express.Router();
var postController = require('../controllers/PostController');

router.post("/", postController.create);
router.get("/:search", postController.find);

module.exports = router;
