const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const artistSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    age: {
        type: Number
    },
    genre: {
        type: String,
        trim: true
    }
});

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;