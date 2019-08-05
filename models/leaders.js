const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leaderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        rquired: true
    },
    abbr: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
},{ timestamps: true });

module.exports = mongoose.model('Leader', leaderSchema);