const express = require('express');

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/products", isAuth, adminController.getAdminProducts);

router.get('/add-product', isAuth, adminController.getAddProduct);

router.post('/add-product', isAuth, adminController.postAddProduct);

router.get("/edit-product/:prodID", isAuth, adminController.getEditProduct);

router.post("/edit-product", isAuth, adminController.postEditProduct);

router.get("/delete-product/:prodID", isAuth, adminController.postDeleteProduct);

router.post("/delete-product/:prodID", isAuth, adminController.postDeleteProduct);

module.exports = router;