const User = require("../models/user");
const bcrypt = require("bcrypt");
const sgMail = require("@sendgrid/mail");

const {API_KEY, MY_EMAIL} = require("../env");

sgMail.setApiKey(API_KEY);

exports.getLogin = (req, res, next) => {
    res.render("auth/login", {
        pageTitle: "Login",
        active: "login",
        invalidEmail: req.flash("invalidEmail")[0],
        invalidPassword: req.flash("invalidPassword")[0],
        email: req.flash("email")[0],
        accountCreated: req.flash("accountCreated")[0]
    });
}

exports.postLogin = (req, res, next) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if (!user) {
                req.flash("invalidEmail", true);
                res.redirect("/login");
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then(passwordMatch => {
                        if (!passwordMatch) {
                            req.flash("invalidPassword", true);
                            req.flash("email", req.body.email);
                            res.redirect("/login");
                        } else {
                            req.session.userId = user._id;
                            req.session.isLoggedIn = true;
                            req.session.save(() => {
                                res.redirect("/");
                            });
                        }
                    });
            }
        });
}

exports.getSignUp = (req, res, next) => {
    res.render("auth/sign-up", {
        pageTitle: "Sign up",
        active: "sign-up",
        emailAlreadyExists: req.flash("emailAlreadyExists")[0]
    });
}

exports.postSignUp = (req, res, next) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if (!user) {
                bcrypt.hash(req.body.password, 10).then(hash => {
                    const user = new User({
                        email: req.body.email,
                        password: hash,
                        cart: {
                            items: [],
                            total: 0
                        }
                    });
                    return user.save();
                }).then(() => {
                    const msg = {
                        to: req.body.email,
                        from: MY_EMAIL,
                        subject: "Shop Account created successfully!",
                        html: "<h1>Welcome to Our Online Shop!</h1>" +
                            "<p>Thank you for registering with us. We're excited to have you as a customer!</p>" +
                            "<p>To start shopping, please log in with your email and password.</p>" +
                            "<a href='http://localhost:3000/login'>Log in now</a>"
                    }
                    sgMail.send(msg).then(() => {
                        console.log("Email sent!");
                    }).catch(err => {
                        console.log(JSON.stringify(err));
                    });
                    req.flash("accountCreated", true);
                    res.redirect("/login");
                });
            } else {
                req.flash("emailAlreadyExists", true);
                res.redirect("/sign-up");
            }
        });
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
}