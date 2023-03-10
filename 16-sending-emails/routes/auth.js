const express = require("express");

const authController = require("../controllers/auth");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);

router.get("/sign-up", authController.getSignUp);

router.post("/sign-up", authController.postSignUp);

router.post("/logout", isAuth, authController.postLogout);

module.exports = router;