const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getIndex = (req, res, next) => {
    res.render("shop/index", {
        pageTitle: "Shop - Home"
    });
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll((prods) => {
        res.render('shop/products', {
            prods: prods,
            pageTitle: 'All Products',
            active: "products"
        });
    });
}

exports.getDetails = (req, res, next) => {
    const prodID = req.params.prodID;
    Product.findById(prodID, (prod) => {
        res.render("shop/product-details", {
            pageTitle: "Shop: " + prod.title,
            product: prod
        });
    });
}

exports.getCart = (req, res, next) => {
    const renderPage = (cart, prods) => {
        res.render('shop/cart', {
            pageTitle: 'Shopping Cart',
            active: "cart",
            cart: cart,
            prods: prods
        });
    }

    Cart.fetchAll(cart => {
        const prods = [];
        if (cart.products && cart.products.length > 0) {
            for (const prod of cart.products) {
                Product.findById(prod.id, (p) => {
                    p.qty = prod.qty;
                    prods.push(p);
                    if (prods.length === cart.products.length) {
                        renderPage(cart, prods);
                    }
                });
            }
        } else {
            renderPage(cart, prods);
        }
    });
}

exports.postCart = (req, res, next) => {
    const prodID = req.body.prodID;
    Product.findById(prodID, (prod) => {
        Cart.addProduct(prodID, prod.price);
        res.redirect("/cart");
    });
}

exports.postDeleteCartProduct = (req, res, next) => {
    const prodID = req.body.prodID;
    const erase = req.body.erase;
    Product.findById(prodID, p => {
       Cart.reduceProduct(prodID, p.price, erase);
       res.redirect("cart");
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
