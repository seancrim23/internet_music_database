const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const albumSchema = new Schema({
    title: {

    },
    releaseDate: {

    },
    artist: {

    },
    genre: {

    }
});

const Album = mongoose.model('albumSchema', albumSchema);

module.exports = Album;