const express = require('express');

const adminController = require("../controllers/admin");

const router = express.Router();

router.get("/products", adminController.getAdminProducts);

router.get('/add-product', adminController.getAddProduct);

router.post('/add-product', adminController.postAddProduct);

router.get("/edit-product/:prodID", adminController.getEditProduct);

router.post("/edit-product", adminController.postEditProduct);

router.get("/delete-product/:prodID", adminController.postDeleteProduct);

router.post("/delete-product/:prodID", adminController.postDeleteProduct);

module.exports = router;