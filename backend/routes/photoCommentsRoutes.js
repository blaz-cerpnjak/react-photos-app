var express = require('express');
var router = express.Router();
var photoCommentsController = require('../controllers/photoCommentsController.js');

function requiresLogin(req, res, next){
    if(req.session && req.session.userId){
        return next();
    } else{
        var err = new Error("You must be logged in to view this page");
        err.status = 401;
        return next(err);
    }
}

/*
 * GET
 */
router.get('/', photoCommentsController.list);

/*
 * GET
 */
router.get('/:id', photoCommentsController.show);

/*
 * POST
 */
router.post('/', requiresLogin, photoCommentsController.create);

/*
 * PUT
 */
router.put('/:id', photoCommentsController.update);

/*
 * DELETE
 */
router.delete('/:id', photoCommentsController.remove);

module.exports = router;
