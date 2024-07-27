const express = require("express");
const db = require("./config/database.config.js");
const dotenv = require("dotenv/config");
const app = express();
const PORT = process.env.PORT;
const bodyParser = require("body-parser");
const router = require("./routes/video.routes.js");
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors("*"));

app.use('/', router);
app.listen(PORT, (err) => {
    if(err){
        console.log("Error while connecting to server");
        return;
    }
    console.log("Connected to server at port 8000");
})