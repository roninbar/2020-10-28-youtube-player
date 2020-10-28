const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    name: String,
    genre: String,
    url: String,
});
const Song = mongoose.model('Song', songSchema);
exports.Song = Song;
