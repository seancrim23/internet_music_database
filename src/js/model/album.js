const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const albumSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    artist: {
        type: String,
        required: true,
        trim: true
    },
    releaseDate: {
        type: Date,
        trim: true
    },
    genre: {
        type: String,
        trim: true
    }
});

const Album = mongoose.model('Album', albumSchema);

module.exports = Album;