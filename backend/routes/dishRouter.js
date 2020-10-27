const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate')
const cors = require('./cors');

const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json())
//first parameter is the end point
//.all: when a request comes in, no matter which method is invoked,
//for the /dishes REST API endpoint, the code inside will be
//executed first
dishRouter.route('/')
//the req and res are passed in from the app.all function
//get request is accessble by all users
//send HTTP OPTIONS req if you need to preflight a request
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200)})
.get(cors.cors, (req,res, next) => {
    Dishes.find(req.query)
    //populate the author field from the user document in there
    .populate('comments.author')
    .then((dishes)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        //return the message as json
        res.json(dishes);
    },( err) => next(err))
    .catch((err) => next(err));
})

//verify the user first, moves on if successful
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res, next) => {
    Dishes.create(req.body)
    .then((dish)=>{
        console.log('DishCreated', dish)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        //return the message as json
        res.json(dish);
    },( err) => next(err))
    .catch((err) => next(err));
})

.put(cors.corsWithOptions, authenticate.verifyUser,(req,res, next) => {
    res.statusCode = 403;
    res.end('PUT operations not supported on /dishes')

})

.delete(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin, (req,res, next) => {
    Dishes.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        //return the message as json
        res.json(resp);    
    },( err) => next(err))
    .catch((err) => next(err));
});

dishRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200)})
.get(cors.cors, (req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        //return the message as json
        res.json(dish);
    },( err) => next(err))
    .catch((err) => next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /dishes/'+ req.params.dishId);
})

.put(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Dishes.findByIdAndUpdate(req.params.dishId,{
        $set: req.body
    }, {new: true})
    .then((dish)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        //return the message as json
        res.json(dish);
    },( err) => next(err))
    .catch((err) => next(err));
})

.delete(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        //return the message as json
        res.json(resp);    
    },( err) => next(err))
    .catch((err) => next(err));
});

module.exports = dishRouter


