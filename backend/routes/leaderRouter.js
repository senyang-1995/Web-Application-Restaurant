const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate')
const cors = require('./cors');

const Leaders = require('../models/leaders');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json())
//first parameter is the end point
//.all: when a request comes in, no matter which method is invoked,
//for the /dishes REST API endpoint, the code inside will be
//executed first
leaderRouter.route('/')

//the req and res are passed in from the app.all function
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200)})
.get(cors.cors, (req,res, next) => {
    Leaders.find(req.query)
    .then((leaders)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        //return the message as json
        res.json(leaders);
    },( err) => next(err))
    .catch((err) => next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,(req,res, next) => {
    Leaders.create(req.body)
    .then((leader)=>{
        console.log('LeaderCreated', leader)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        //return the message as json
        res.json(leader);
    },( err) => next(err))
    .catch((err) => next(err));
})

.put(cors.corsWithOptions, authenticate.verifyUser,(req,res, next) => {
    res.statusCode = 403;
    res.end('PUT operations not supported on /leaders')

})

.delete(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,(req,res, next) => {
    Leaders.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        //return the message as json
        res.json(resp);    
    },( err) => next(err))
    .catch((err) => next(err));
});

leaderRouter.route('/:leaderId')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200)})
.get(cors.cors, (req,res,next) => {
    Leaders.findById(req.params.leaderId)
    .then((leader)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        //return the message as json
        res.json(leader);
    },( err) => next(err))
    .catch((err) => next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /leaders/'+ req.params.leaderId);
})

.put(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId,{
        $set: req.body
    }, {new: true})
    .then((leader)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        //return the message as json
        res.json(leader);
    },( err) => next(err))
    .catch((err) => next(err));
})

.delete(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        //return the message as json
        res.json(resp);    
    },( err) => next(err))
    .catch((err) => next(err));
});


module.exports = leaderRouter


