var express = require('express');
var router = express.Router();
var userController = require('../controllers/UserController')

/* GET users listing. */
router.get('/:username', userController.getOne);
router.get('/', userController.getAll);

router.post('/',userController.register);
router.put('/:username', userController.update);
router.delete('/:username',userController.delete);

module.exports = router;
