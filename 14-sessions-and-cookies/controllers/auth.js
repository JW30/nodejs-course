const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.getLogin = (req, res, next) => {
    res.render("auth/login", {
        pageTitle: "Login",
        active: "login",
        isLoggedIn: req.session.isLoggedIn
    });
}

exports.postLogin = (req, res, next) => {
    let foundUser;
    User.findOne({email: req.body.email})
        .then(user => {
            if (!user) {
                console.log("Email does not exist!");
                return Promise.resolve();
            } else {
                foundUser = user;
                return bcrypt.compare(req.body.password, user.password);
            }
        })
        .then(passwordMatch => {
            if (!passwordMatch) {
                console.log("Wrong password!");
                return res.redirect("/login");
            } else {
                req.session.userId = foundUser._id;
                req.session.isLoggedIn = true;
                return req.session.save();
            }
        })
        .then(() => {
            res.redirect("/");
        });
}

exports.getRegister = (req, res, next) => {
    res.render("auth/register", {
        pageTitle: "Register",
        isLoggedIn: req.session.isLoggedIn
    });
}

exports.postRegister = (req, res, next) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if (!user) {
                return bcrypt.hash(req.body.password, 10);
            }
            console.log("This email is already in use!");
            return res.redirect("/register");
        })
        .then(hash => {
            const user = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: hash,
                cart: {
                    items: [],
                    total: 0
                }
            });
            return user.save();
        })
        .then(() => {
            res.redirect("/login");
        });
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
}