const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate')
const multer = require('multer');
const cors = require('./cors');


const storage = multer.diskStorage({
    //cb is the callback function
    destination: (req, file, cb) => {
        //error and destination folder
        cb(null, 'public/images');
    },

    filename: (req, file, cb) => {
        //default file name would be some random string
        cb(null, file.originalname)
    }

});

const imageFileFilter = (req, file, cb) => {
    //if the file is not the format we want
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        return cb(new Error('You can upload only image files!'), false)
    }
    cb(null, true);
}

const upload = multer({ storage: storage, fileFilter: imageFileFilter})

const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json())
//first parameter is the end point
//.all: when a request comes in, no matter which method is invoked,
//for the /dishes REST API endpoint, the code inside will be
//executed first
uploadRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200)})
.get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req,res, next) => {
    res.statusCode = 403;
    res.end('GET operations not supported on /imageUpload')
})
//imageFile is the form field, upload.single will take care of errors
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,
upload.single('imageFile'), (req,res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res, next) => {
    res.statusCode = 403;
    res.end('PUT operations not supported on /imageUpload')
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res, next) => {
    res.statusCode = 403;
    res.end('DELETE operations not supported on /imageUpload')
})

module.exports = uploadRouter;