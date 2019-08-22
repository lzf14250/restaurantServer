const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Favorites = require('../models/favorites');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
    .populate('user')
    .populate('dishes')
    .then((doc) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(doc);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
    .then((doc) => {
        if (doc) {
            // user doc already exists
            for(var i = 0; i < req.body.length; i++) {
                if (doc.dishes.indexOf(req.body[i]._id) === -1) {
                    doc.dishes.push(req.body[i]._id);
                }
            }
            doc.save()
            .then((doc) => {
                Favorites.findById(doc._id)
                .populate('user')
                .populate('dishes')
                .then((doc) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(doc);
                });
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else {
            // no favorites doc exists for this user
            Favorites.create({ user: req.user._id })
            .then((doc) => {
                for(var i = 0; i < req.body.length; i++) {
                    doc.dishes.push(req.body[i]._id);
                }
                doc.save()
                .then((doc) => {
                    Favorites.findById(doc._id)
                    .populate('user')
                    .populate('dishes')
                    .then((doc) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(doc);
                    });
                }, (err) => next(err));
            }, (err) => next(err))
            .catch((err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOneAndDelete({ user: req.user._id })
    .populate('user')
    .populate('dishes')
    .then((doc) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(doc);
    }, (err) => next(err))
    .catch((err) => next(err));
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
    .then((doc) => {
        if (!doc) {
            res.status(200);
            res.setHeader('Content-Type', 'application/json');
            res.json({
                "exists": false,
                "favorites": doc
            });
        }
        else {
            if (doc.dishes.indexOf(req.params.dishId) === -1) {
                res.status(200);
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    "exists": false,
                    "favorites": doc
                });
            }
            else {
                res.status(200);
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    "exists": true,
                    "favorites": doc
                });
            }
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
    .then((doc) => {
        if (doc) {
            // user doc already exists
            if (doc.dishes.indexOf(req.params.dishId) === -1) {
                doc.dishes.push(req.params.dishId);
            }
            doc.save()
            .then((doc) => {
                Favorites.findById(doc._id)
                .populate('user')
                .populate('dishes')
                .then((doc) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(doc);
                });
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else {
            // no favorites doc exists for this user
            Favorites.create({ user: req.user._id })
            .then((doc) => {
                doc.dishes.push(req.params.dishId);
                doc.save()
                .then((doc) => {
                    Favorites.findById(doc._id)
                    .populate('user')
                    .populate('dishes')
                    .then((doc) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(doc);
                    });
                });
            }, (err) => next(err))
            .catch((err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/'+ req.params.dishId);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
    .then((doc) => {
        if (doc) {
            var indexOfDish = doc.dishes.indexOf(req.params.dishId);
            if (indexOfDish !== -1) {
                // delete the ele in array
                doc.dishes.splice(indexOfDish, 1);
                doc.save()
                .then((doc) => {
                    Favorites.findById(doc._id)
                    .populate('user')
                    .populate('dishes')
                    .then((doc) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(doc);
                    });
                }, (err) => next(err))
                .catch((err) => next(err));
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(doc);
            }
        }
        else {
            res.statusCode = 403;
            res.end('No Recored found.');
        }
    })
    .catch((err) => next(err));
});

module.exports = favoriteRouter;