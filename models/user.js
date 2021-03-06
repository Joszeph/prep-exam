const mongoose = require('mongoose');
const UserShcema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        minlength: 5
    },

    password: {
        type: String,
        required: true,
        minlength:5
    },

    likedPlays: [{
        type: 'ObjectId',
        ref: 'Play'
    }]

})

module.exports = mongoose.model('User', UserShcema);