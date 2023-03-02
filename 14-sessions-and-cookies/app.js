const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const User = require("./models/user");
const errorsController = require("./controllers/errors");

const MONGODB_URI = "mongodb+srv://user:pass1234@cluster0.7l5w0mp.mongodb.net/shop?retryWrites=true&w=majority";

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: "sessions"
});

app.set("view engine", "pug");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store
}));

app.use((req, res, next) => {
    if (!req.session.userId) {
        return next();
    }
    User.findById(req.session.userId).then(user => {
        req.user = user;
        next();
    })
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorsController.pageNotFound);

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        app.listen(3000)
    })
    .catch(err => {
        console.log(err);
    });
