var PhotoModel = require('../models/photoModel.js');
var PhotoCommentsModel = require('../models/photoCommentsModel.js');

/**
 * photoController.js
 *
 * @description :: Server-side logic for managing photos.
 */
module.exports = {

    /**
     * photoController.list()
     */
    list: function (req, res) {
        PhotoModel.find()
        .sort('-datetime')
        .populate('postedBy')
        .exec(function (err, photos) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo.',
                    error: err
                });
            }
            var data = [];
            data.photos = photos;
            return res.json(photos);
        });
    },

    /**
     * photoController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        PhotoModel.findOne({_id: id})
        .populate('postedBy')
        .populate({
			path: 'comments',
			populate: {path: 'postedBy'}
		})
        .exec(function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo.',
                    error: err
                });
            }

            if (!photo) {
                return res.status(404).json({
                    message: 'No such photo'
                });
            }

            return res.json(photo);
        });
    },

    /**
     * photoController.create()
     */
    create: function (req, res) {
        var photo = new PhotoModel({
			name : req.body.name,
			path : "/images/"+req.file.filename,
			postedBy : req.session.userId,
			views : 0,
			likes : 0,
            hidden: false,
            datetime: new Date()
        });

        photo.save(function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating photo',
                    error: err
                });
            }

            return res.status(201).json(photo);
            //return res.redirect('/photos');
        });
    },

    /**
     * photoController.comment()
     */
     comment: function (req, res) {
        const id = req.body.photoId;
        console.log("ID: " + id);
        const comment = new PhotoCommentsModel({
            postedBy: req.session.userId,
            photoId: id,
            datetime: new Date(),
            comment: req.body.comment
        });
        
        comment.save(function (err, photoComment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating answerComments',
                    error: err
                });
            }

            PhotoModel.findById(id, function (err, photo) {
                if (err) {
                    return res.status(500).json({
                        message: 'Photo not found.',
                        error: err
                    });
                }

                photo.comments.push(photoComment);

                photo.save(function (err) {
                    if(err) {
                        console.log(err);
                        return res.status(500).json({
                            message: 'Error while saving photo data.',
                            error: err
                        })
                    }
                })
            });
        });
    },

    /**
     * photoController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        PhotoModel.findOne({_id: id}, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo',
                    error: err
                });
            }

            if (!photo) {
                return res.status(404).json({
                    message: 'No such photo'
                });
            }

            photo.name = req.body.name ? req.body.name : photo.name;
			photo.path = req.body.path ? req.body.path : photo.path;
			photo.postedBy = req.body.postedBy ? req.body.postedBy : photo.postedBy;
			photo.views = req.body.views ? req.body.views : photo.views;
			photo.likes = req.body.likes ? req.body.likes : photo.likes;
			photo.reports = req.body.reports ? req.body.reports : photo.reports;

            photo.save(function (err, photo) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating photo.',
                        error: err
                    });
                }

                return res.json(photo);
            });
        });
    },

    /**
     * photoController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        PhotoModel.findByIdAndRemove(id, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the photo.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },

    publish: function(req, res){
        return res.render('photo/publish');
    }
};
