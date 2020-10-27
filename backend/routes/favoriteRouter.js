const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate')
const cors = require('./cors');

const Favorites = require('../models/favorites');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')

.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200)})
.all(authenticate.verifyUser)

.get(cors.cors, (req,res, next) => {
    Favorites.findOne({user: req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorites)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        //return the message as json
        if(favorites == null){
            res.json({dishes: []});
        }
        else{
            res.json(favorites);
        }
    },( err) => next(err))
    .catch((err) => next(err));
})

.post(cors.corsWithOptions, (req,res, next) => {

    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if (favorite == null){
            Favorites.create({user: req.user._id})
            .then((favorite) => {
                for (var i = (req.body.length -1); i >= 0; i--){
                    console.log(req.body[i]._id)
                    if (favorite.dishes.indexOf(req.body[i]._id) === -1) {
                        favorite.dishes.push(req.body[i]._id)
                    }
                }
                favorite.save()
                .then((favorite) => {
                    Favorites.findById(favorite._id)
                        .populate('user')
                        .populate('dishes')
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                }, (err) => next(err))
            })
        }

        else{
            for (var i = (req.body.length -1); i >= 0; i--){
                console.log(req.body[i]._id)
                if (favorite.dishes.indexOf(req.body[i]._id) === -1) {
                    favorite.dishes.push(req.body[i]._id)
                }
            }
            favorite.save()
            .then((favorite) => {
                Favorites.findById(favorite._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
            }, (err) => next(err))
        }
    },( err) => next(err))
    .catch((err) => next(err));
})



.delete(cors.corsWithOptions, (req,res, next) => {
    Favorites.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        //return the message as json
        res.json(resp);    
    },( err) => next(err))
    .catch((err) => next(err));
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200)})
.all(authenticate.verifyUser)

.get(cors.corsWithOptions, (req,res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorites) => {
        if(!favorites){
            res.statusCode = 200;
            res.setHeader('Content-Type','applicaiton/json');
            return res.json({"exists": false, "favorites": favorites})
        }
        else{
            if(favorites.dishes.indexOf(req.params.dishId) < 0){
                res.statusCode = 200;
                res.setHeader('Content-Type','applicaiton/json');
                return res.json({"exists": false, "favorites": favorites})
            }
            else{
                res.statusCode = 200;
                res.setHeader('Content-Type','applicaiton/json');
                return res.json({"exists": true, "favorites": favorites})
            }
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})

.post(cors.corsWithOptions, (req,res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if (favorite == null){
            Favorites.create({user: req.user._id})
            .then((favorite) => {
                favorite.dishes.push(req.params.dishId)
                favorite.save()
                .then((favorite) => {
                    Favorites.findById(favorite._id)
                        .populate('user')
                        .populate('dishes')
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                }, (err) => next(err))
            },(err) => next(err))
        }
        else{
            if (favorite.dishes.indexOf(req.params.dishId) === -1) {
                favorite.dishes.push(req.params.dishId)
                favorite.save()
                .then((favorite) => {
                    Favorites.findById(favorite._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    },(err) => next(err))
                }, (err) => next(err))
            }
            else {
                err = new Error('Dish ' + req.params.dishId + ' is already in favorite')
                err.status = 404;
                return next(err);
            }
        }
    },(err) => next(err))
    .catch((err) => next(err))
})

.delete(cors.corsWithOptions, (req,res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if (favorite != null &&  favorite.dishes.indexOf(req.params.dishId) !== -1) {
            favorite.dishes.pull(req.params.dishId)
            favorite.save()
            .then((favorite) => {
                Favorites.findById(favorite._id)
                .populate('user')
                .populate('dishes')
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })              
            }, (err) => next(err));
        }      
        else if (favorite != null &&  favorite.dishes.indexOf(req.params.dishId) === -1){
            err = new Error('Dish ' + req.params.dishId + ' is not in favorite')
            err.status = 404;
            return next(err);           
        }
        else {
            err = new Error('Favorites do not exist')
            err.status = 404;
            return next(err);
        }  
    },(err) => next(err))
    .catch((err) => next(err))
})

module.exports = favoriteRouter
