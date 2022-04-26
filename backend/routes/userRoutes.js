var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');
var multer = require('multer');
var upload = multer({dest: 'public/images/'});

router.get('/', userController.list);
router.get('/profile/:id', userController.profile);
router.get('/logout', userController.logout);
router.get('/:id', userController.show);

router.post('/', upload.single('image'), userController.create);
router.post('/login', userController.login);

router.put('/:id', userController.update);

router.delete('/:id', userController.remove);

module.exports = router;
