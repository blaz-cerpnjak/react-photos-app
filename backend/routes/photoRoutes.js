var express = require('express');
var multer = require('multer');
var upload = multer({dest: 'public/images/'});

var router = express.Router();
var photoController = require('../controllers/photoController.js');

function requiresLogin(req, res, next){
    if(req.session && req.session.userId){
        return next();
    } else{
        var err = new Error("You must be logged in to view this page");
        err.status = 401;
        return next(err);
    }
}

router.get('/', photoController.list);
router.get('/:id', photoController.show);
router.get('/user/:id', photoController.listUserPhotos);
router.get('/likes/user/:id', photoController.listUserPhotosLikes);

router.post('/', requiresLogin, upload.single('image'), photoController.create);
router.post('/comment', requiresLogin, photoController.comment);

router.put('/:id', photoController.update);

router.delete('/:id', photoController.remove);

module.exports = router;
