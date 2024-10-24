const SpotifyService = require('../Utils/SpotifyServices');
const { asyncHandler, CustomError } = require('../Utils/Utils');




exports.searchSongs = asyncHandler(async (req, res, next) => {
    const { query, limit } = req.query;

    if (!query) {
        return next(new CustomError('Search query is required', 400));
    }

    const spotifyService = SpotifyService.getInstance();
    const songs = await spotifyService.searchSongs(query, limit);

    if (!songs || songs.length === 0) {
        return next(new CustomError('No songs found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            songs
        }
    });

});


