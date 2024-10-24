const express = require('express');
const spotifyRouter = express.Router();
const { searchSongs } = require('../Controller/Search.controller');
const authMiddleware = require('../Middleware/Auth.middleware.js');

spotifyRouter.use(authMiddleware);
spotifyRouter.get('/search-songs', searchSongs);

module.exports = spotifyRouter;
