const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorsController = require("./controllers/errors");
const sequelize = require("./util/database");

const User = require("./models/user");
const setModelRelations = require("./models/relations");

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1).then(user => {
        req.user = user;
        next();
    }).catch(err => {
        console.log(err);
    })
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorsController.pageNotFound);

setModelRelations();
sequelize
    .sync()
    .then(() => {
        return User.findByPk(1);
    })
    .then(user => {
        if (!user) {
            return User.create({
                id: 1,
                firstName: "Bob",
                lastName: "Ross",
                email: "email@email.com"
            });
        } else {
            return user;
        }
    })
    .then(() => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });