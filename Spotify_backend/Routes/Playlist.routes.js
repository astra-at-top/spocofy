const express = require('express');
const playlistRouter = express.Router();
const authMiddleware = require('../Middleware/Auth.middleware.js');
const {
    createPlaylist,
    getUserPlaylists,
    updatePlaylist,
    deletePlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist
} = require('../Controller/Playlist.controller');



playlistRouter.use(authMiddleware);

playlistRouter.post('/', createPlaylist);
playlistRouter.get('/', getUserPlaylists);
playlistRouter.put('/:id', updatePlaylist);
playlistRouter.delete('/:id', deletePlaylist);
playlistRouter.post('/:id/songs', addSongToPlaylist);
playlistRouter.delete('/:id/songs', removeSongFromPlaylist);

module.exports = playlistRouter;
