const mongoose = require('mongoose');

const { Schema } = mongoose;

const ImagesSchema = new Schema({
    imageURL: {type: String, required: true},
    name: {type: String, required: true}
});

module.exports = mongoose.model('Images', ImagesSchema);