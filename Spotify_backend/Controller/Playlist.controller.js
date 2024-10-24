const Playlist = require('../Models/Playlist');
const { asyncHandler, CustomError } = require('../Utils/Utils');

exports.createPlaylist = asyncHandler(async (req, res) => {
    const { name, description, coverImage } = req.body;
    const owner = req.user._id;
    const existingPlaylist = await Playlist.findOne({ name, owner });
    if (existingPlaylist) {
        throw new CustomError('A playlist with this name already exists', 400);
    }
    let playlist = await Playlist.create({
        name,
        description,
        coverImage,
        owner
    });

    playlist = playlist.toObject();
    delete playlist.createdAt;
    delete playlist.updatedAt;
    delete playlist.owner;
    delete playlist.__v;

    res.status(201).json({
        success: true,
        data: playlist
    });
});

exports.getUserPlaylists = asyncHandler(async (req, res) => {
    const playlists = await Playlist.find({ owner: req.user._id })
        .select('-__v -updatedAt -createdAt -owner');

    res.status(200).json({
        success: true,
        data: playlists
    });
});

exports.updatePlaylist = asyncHandler(async (req, res, next) => {
    const { name, description, coverImage } = req.body;
    let playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
        return next(new CustomError('Playlist not found', 404));
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        return next(new CustomError('User not authorized to update this playlist', 403));
    }

    Object.keys(req.body).forEach((key) => {
        playlist[key] = req.body[key];
    });

    if (name) playlist.name = name;
    if (description) playlist.description = description;
    if (coverImage) playlist.coverImage = coverImage;

    await playlist.save();

    const updatedPlaylist = await Playlist.findById(req.params.id);

    res.status(200).json({
        success: true,
        data: updatedPlaylist
    });
});

exports.deletePlaylist = asyncHandler(async (req, res, next) => {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
        return next(new CustomError('Playlist not found', 404));
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        return next(new CustomError('User not authorized to delete this playlist', 403));
    }

    await playlist.deleteOne({ _id: req.params.id });

    res.status(200).json({
        success: true,
    });
});

exports.addSongToPlaylist = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { songData } = req.body;

    const playlist = await Playlist.findById(id);
    if (!playlist) {
        return res.status(404).json({ status: 'fail', message: 'Playlist not found' });
    }

    const songExists = playlist.songs.some(song => song.spotifyId === songData.id);
    if (songExists) {
        return res.status(400).json({ status: 'fail', message: 'Song already in playlist' });
    }

    playlist.songs.push({...songData, spotifyId:songData.id});
    await playlist.save();

    res.status(200).json({
        status: 'success',
        data: {
            playlist
        }
    });
});

exports.removeSongFromPlaylist = asyncHandler(async (req, res, next) => {
    const { songId } = req.body;
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
        return next(new CustomError('Playlist not found', 404));
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        return next(new CustomError('User not authorized to modify this playlist', 403));
    }

    const index = playlist.songs.findIndex(song => song.spotifyId === songId);
    if (index > -1) {
        playlist.songs.splice(index, 1);
        await playlist.save();
    }

    res.status(200).json({
        success: true,
        data: playlist
    });
});
