var PhotocommentsModel = require('../models/photoCommentsModel.js');

/**
 * photoCommentsController.js
 *
 * @description :: Server-side logic for managing photoCommentss.
 */
module.exports = {

    /**
     * photoCommentsController.list()
     */
    list: function (req, res) {
        PhotocommentsModel.find(function (err, photoCommentss) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photoComments.',
                    error: err
                });
            }

            return res.json(photoCommentss);
        });
    },

    /**
     * photoCommentsController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        PhotocommentsModel.findOne({_id: id}, function (err, photoComments) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photoComments.',
                    error: err
                });
            }

            if (!photoComments) {
                return res.status(404).json({
                    message: 'No such photoComments'
                });
            }

            return res.json(photoComments);
        });
    },

    /**
     * photoCommentsController.create()
     */
    create: function (req, res) {
        var photoComments = new PhotocommentsModel({
			comment : req.body.comment,
			datetime : req.body.datetime,
            reports: 0,
            hidden: false
        });

        photoComments.save(function (err, photoComments) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating photoComments',
                    error: err
                });
            }

            return res.status(201).json(photoComments);
        });
    },

    /**
     * photoCommentsController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        PhotocommentsModel.findOne({_id: id}, function (err, photoComments) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photoComments',
                    error: err
                });
            }

            if (!photoComments) {
                return res.status(404).json({
                    message: 'No such photoComments'
                });
            }

            photoComments.comment = req.body.comment ? req.body.comment : photoComments.comment;
			photoComments.datetime = req.body.datetime ? req.body.datetime : photoComments.datetime;
			
            photoComments.save(function (err, photoComments) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating photoComments.',
                        error: err
                    });
                }

                return res.json(photoComments);
            });
        });
    },

    /**
     * photoCommentsController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        console.log(id);
        PhotocommentsModel.findByIdAndRemove(id, function (err, photoComments) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the photoComments.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
