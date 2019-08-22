const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    dish: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: { 
        type: String,
        required: true
    },
    author: {
        // reference the User model
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    timestamps: true
});

module.exports = mongoose.model('Comment', commentSchema);