const express = require("express");
const mongoose = require("mongoose");
const app = express();
var cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.fkglc.mongodb.net/instaDB?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }
);
mongoose.connection.on("connected", () => {
    console.log("connected to mongo");
});
mongoose.connection.on("error", (err) => {
    console.log("err connecting", err);
});

require("./models/user");
require("./models/post");

const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
    const path = require("path");
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}

app.listen(PORT, () => {
    console.log("server is running on", PORT);
});
