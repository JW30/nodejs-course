const Product = require("../models/product");

exports.getIndex = (req, res, next) => {
    res.render("shop/index", {
        pageTitle: "Shop - Home"
    });
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/products', {
            prods: products,
            pageTitle: 'All Products',
            active: "products"
        });
    });
}

exports.getCart = (req, res, next) => {
    res.render('shop/cart', {
        pageTitle: 'Shopping Cart',
        active: "cart"
    });
}

exports.getCheckout = (req, res, next) => {
    res.render("shop/checkout", {
        pageTitle: "Checkout"
    });
}

exports.getOrders = (req, res, next) => {
    res.render("shop/orders", {
        pageTitle: "Your Orders",
        active: "orders"
    });
}

