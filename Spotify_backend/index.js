const Express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require('cookie-parser');
const SpotifyService = require("./Utils/SpotifyServices")

const authRouter = require("./Routes/Auth.routes")
const spotifyRouter = require("./Routes/Spotify.routes")
const playlistRouter = require("./Routes/Playlist.routes")
const { globalErrorHandler } = require("./Utils/Utils");

const App = Express();
require('dotenv').config();

App.use(cookieParser());
App.use(Express.json());
App.use(helmet())
App.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}))
App.use(morgan("dev"))



App.use("/api/auth", authRouter)
App.use("/api/spotify", spotifyRouter)
App.use("/api/playlist", playlistRouter)
App.use(globalErrorHandler)

mongoose.connect(process.env.MONGODBCONNECTIONURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("Connected to MongoDB");
    App.listen(process.env.PORTNO || 3000, async () => {
        console.log("Server successfully started");
        try {
            await SpotifyService.initialize();
            console.log('SpotifyService initialized successfully');
        } catch (error) {
            console.error('Error initializing SpotifyService:', error);
            console.log('Stopping server due to initialization error');
            process.exit(1);
        }
    });
})
.catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});