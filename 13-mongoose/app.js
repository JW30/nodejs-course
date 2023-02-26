const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const errorsController = require("./controllers/errors");
const User = require("./models/user");

const app = express();

app.set("view engine", "pug");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    User.findOne().then(user => {
        if (!user) {
            const user = new User({
                firstName: "first",
                lastName: "last",
                email: "user@user.com",
                cart: {
                    items: [],
                    total: 0
                }
            });
            req.user = user;
            return user.save();
        } else {
            req.user = user;
            return Promise.resolve();
        }
    }).then(() => {
        next();
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorsController.pageNotFound);

mongoose
    .connect("mongodb+srv://user:pass1234@cluster0.7l5w0mp.mongodb.net/shop?retryWrites=true&w=majority")
    .then(() => {
        app.listen(3000)
    })
    .catch(err => {
        console.log(err);
    });
