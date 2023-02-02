const express = require("express");

const router = express.Router();

const users = [];

router.get("/add-user", (req, res, next) => {
    res.render("add-user", {active: "add-user"});
});

router.post("/add-user", (req, res, next) => {
    users.push({username: req.body.username});
    res.redirect("/");
});

router.post("/del-users", (req, res, next) => {
    users.length = 0;
    res.redirect("/");
});

exports.route = router;
exports.users = users;