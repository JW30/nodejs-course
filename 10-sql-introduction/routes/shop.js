const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get("/", shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get("/products/:prodID", shopController.getDetails);

router.get("/cart", shopController.getCart);

router.post("/cart", shopController.postCart);

router.post("/reduce-product", shopController.postReduceCartProduct);

router.post("/delete-product", shopController.postDeleteCartProduct)

router.get("/checkout", shopController.getCheckout);

router.get("/orders", shopController.getOrders);

module.exports = router;