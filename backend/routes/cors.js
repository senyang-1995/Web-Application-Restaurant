const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = ['http://localhost:3001', 'https://localhost:3443', 'http://xiaopeng-dus-MacBook-Air.local:3001']
var corsOptionsDelegate = (req, callback) => {
    var corsOptions;

    //if the origin in the header is in the whitelist
    if(whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true };
    }
    else{
        corsOptions = { origin: false };
    }
    callback(null, corsOptions)
};

//cors() without any options: reply back access controll allow origin with *
exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate)