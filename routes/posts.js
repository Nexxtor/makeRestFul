var express = require('express');
var router = express.Router();
var postController = require('../controllers/PostController');


router.get("/search/:search", postController.find);
router.get("/:id",postController.getOne);
router.get("/", (req,res,next) => { req.listPost = true; next()},postController.find);

router.post("/", postController.create);
router.put("/:id",postController.update);

router.delete("/:id",postController.delete);
module.exports = router;
