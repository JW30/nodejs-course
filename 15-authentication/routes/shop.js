const express = require('express');

const shopController = require('../controllers/shop');
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products/:prodID", shopController.getDetails);

router.get('/products', shopController.getProducts);

router.get("/cart", isAuth, shopController.getCart);

router.post("/cart", isAuth, shopController.postCart);

router.post("/reduce-product", isAuth, shopController.postReduceCartProduct);

router.post("/delete-product", isAuth, shopController.postDeleteCartProduct)

router.post("/checkout", isAuth, shopController.postCheckout);

router.get("/orders", isAuth, shopController.getOrders);

module.exports = router;