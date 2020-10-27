var mongoose = require('mongoose');
const { Schema } = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose')

var User = new Schema({
    firstname: {
        type: String,
        defailt: ''
    },
    lastname: {
        type: String,
        defailt: ''
    },
    facebookId: String,
    admin:   {
        type: Boolean,
        default: false
    }
});

//username and password automatically included in passport local mongoose
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);