const mongoose = require('mongoose');
const songSchema = new mongoose.Schema({
    spotifyId: {
      type: String,
      required: true
    },
    name: String,
    artists: [String],
    album: String,
    duration_ms: Number,
    image_url: String,
    popularity : Number,
    preview_url : String
  }, { _id: false }); 

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Playlist name is required'],
        trim: true,
        maxlength: [100, 'Playlist name cannot be more than 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Playlist must belong to a user']
    },
    songs: [songSchema],
    coverImage: {
        type: String,
    }
}, {
    timestamps: true
});

// Index for faster queries
playlistSchema.index({ owner: 1, name: 1 });

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;
