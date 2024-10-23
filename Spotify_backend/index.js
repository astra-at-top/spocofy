const Express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require('cookie-parser');

const authRouter = require("./Routes/Auth.routes")
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
App.use(globalErrorHandler)

mongoose.connect(process.env.MONGODBCONNECTIONURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("Connected to MongoDB");
    App.listen(process.env.PORTNO || 3000, () => {
        console.log("Server successfully started");
    });
})
.catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});