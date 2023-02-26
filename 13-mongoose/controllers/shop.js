const Product = require("../models/product");

exports.getIndex = (req, res, next) => {
    res.render("shop/index", {
        pageTitle: "Shop - Home"
    });
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(prods => {
            res.render("shop/products", {
                prods: prods,
                pageTitle: "All Products",
                active: "products"
            });
        });
}

exports.getDetails = (req, res, next) => {
    const prodID = req.params.prodID;
    Product.findById(prodID)
        .then(prod => {
            res.render("shop/product-details", {
                pageTitle: "Shop: " + prod.title,
                prod: prod
            });
        });
}

exports.getCart = (req, res) => {
    req.user.getCart().then(cart => {
        res.render("shop/cart", {
            cart: cart,
            active: "cart"
        });
    });
}

exports.postCart = (req, res) => {
    Product.findById(req.body.prodID)
        .then(prod => {
            return req.user.addCartItem(prod);
        })
        .then(() => {
            res.redirect("/cart")
        });
}

exports.postReduceCartProduct = (req, res, next) => {
    req.user.reduceCartItemById(req.body.prodID)
        .then(() => {
            res.redirect("/cart");
        });
}

exports.postDeleteCartProduct = (req, res, next) => {
    req.user.deleteCartItemById(req.body.prodID)
        .then(() => {
            res.redirect("/cart");
        });
}

exports.getCheckout = (req, res, next) => {
    res.render("shop/checkout", {
        pageTitle: "Checkout"
    });
}

exports.postCheckout = (req, res, next) => {
    req.user.addOrder().then(() => {
        res.redirect("/orders");
    });
}

exports.getOrders = (req, res, next) => {
    req.user.getOrders().then(orders => {
        res.render("shop/orders", {
            pageTitle: "Your Orders",
            active: "orders",
            orders: orders
        });
    });
}
