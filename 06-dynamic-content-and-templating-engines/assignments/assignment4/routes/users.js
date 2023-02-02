const express = require("express");

const data = require("./add-user");

const router = express.Router();

router.get("/", (req, res, next) => {
    res.render("users", {users: data.users, active: "users"});
});

module.exports = router;
