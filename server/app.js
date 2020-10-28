const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const { Song } = require('./models/Song');
const debug = require('debug');

const MONGODBURL = process.env['MONGODBURL'] || 'mongodb://localhost/youtube';

mongoose.connect(MONGODBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, function(error) {
    debug('server:mongodb')(`Connected to ${MONGODBURL}.`);
});

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const songApi = new express.Router();

/**
 * GET all songs.
 */
songApi.get('/all', async function (req, res) {
    const songs = await Song.find();
    return res.json(songs);
});

/**
 * Add a song.
 */
songApi.post('/', async function (req, res) {
    const song = new Song(req.body);
    await song.save();
    return res.status(201).set('Location', `/song/${song._id}`).json(song);
});

app.use('/api/song', songApi);

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
