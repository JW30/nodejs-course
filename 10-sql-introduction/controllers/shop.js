const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getIndex = (req, res, next) => {
    res.render("shop/index", {
        pageTitle: "Shop - Home"
    });
}

exports.getProducts = (req, res, next) => {
    Product.getAll().then(([rows, fieldData]) => {
        res.render('shop/products', {
            prods: rows,
            pageTitle: 'All Products',
            active: "products"
        });
    });
}

exports.getDetails = (req, res, next) => {
    const prodID = req.params.prodID;
    Product.getById(prodID).then(([rows, fieldData]) => {
        const prod = rows[0];
        res.render("shop/product-details", {
            pageTitle: "Shop: " + prod.title,
            prod: prod
        });
    });
}

exports.getCart = (req, res, next) => {
    Cart.getAll(1).then(prodResult => {
        Cart.getOrderValueByUserId(1).then(orderValueData => {
            const orderValue = orderValueData[0][0].orderValue;
            res.render("shop/cart", {
                prods: prodResult[0],
                orderValue: Number(orderValue).toFixed(2),
                deliveryFee: orderValue > 50 ? "FREE" : "$4.99",
                total: Number(orderValue ? (orderValue > 50 ? orderValue : orderValue + 4.99) : 4.99).toFixed(2)
            });
        });
    });
}

exports.postCart = (req, res, next) => {
    const prodID = req.body.prodID;
    Cart.addProduct(1, prodID).then(() => {
        res.redirect("/cart");
    });
}

exports.postReduceCartProduct = (req, res, next) => {
    const prodID = req.body.prodID;
    Cart.reduceProduct(1, prodID).then(() => {
        res.redirect("/cart");
    });
}

exports.postDeleteCartProduct = (req, res, next) => {
    const prodID = req.body.prodID;
    Cart.deleteProduct(1, prodID).then(() => {
        res.redirect("/cart");
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
