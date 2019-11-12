var express = require('express');
var router = express.Router();
var userController = require('../controllers/UserController')

/* GET users listing. */
router.get('/:username', userController.searchOne);

module.exports = router;
