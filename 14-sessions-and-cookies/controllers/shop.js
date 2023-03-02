const Product = require("../models/product");
const Order = require("../models/order");
const User = require("../models/user");

exports.getIndex = (req, res, next) => {
    res.render("shop/index", {
        pageTitle: "Shop - Home",
        isLoggedIn: req.session.isLoggedIn
    });
}

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(prods => {
            res.render("shop/products", {
                prods: prods,
                pageTitle: "All Products",
                active: "products",
                isLoggedIn: req.session.isLoggedIn
            });
        });
}

exports.getDetails = (req, res, next) => {
    const prodID = req.params.prodID;
    Product.findById(prodID)
        .then(prod => {
            res.render("shop/product-details", {
                pageTitle: "Shop: " + prod.title,
                prod: prod,
                isLoggedIn: req.session.isLoggedIn
            });
        });
}

exports.getCart = (req, res) => {
    req.user.populate({
        path: "cart.items._id",
        model: "Product"
    }).then(user => {
        console.log(user.cart);
        res.render("shop/cart", {
            cart: user.cart,
            active: "cart",
            isLoggedIn: req.session.isLoggedIn
        });
    });
}

exports.postCart = (req, res) => {
    Product.findById(req.body.prodID).then(prod => {
        let cartItem = req.user.cart.items.find(item => {
            return item._id.toString() === prod._id.toString();
        });
        if (!cartItem) {
            cartItem = {_id: prod._id, qty: 1, total: prod.price}
            req.user.cart.items.push(cartItem);
        } else {
            cartItem.qty += 1;
            cartItem.total = Number((cartItem.total + prod.price).toFixed(2));
        }
        req.user.cart.total = Number((req.user.cart.total + prod.price).toFixed(2));
        return req.user.save();
    }).then(() => {
        res.redirect("/cart");
    });
}

exports.postReduceCartProduct = (req, res, next) => {
    Product.findById(req.body.prodID).then(prod => {
        let cartItem = req.user.cart.items.find(item => {
            return item._id.toString() === prod._id.toString();
        });
        if (cartItem.qty === 1) {
            req.user.cart.items = req.user.cart.items.filter(item => {
                return item._id.toString() !== prod._id.toString();
            });
        } else {
            cartItem.qty -= 1;
            cartItem.total = Number((cartItem.total - prod.price).toFixed(2));
        }
        req.user.cart.total = Number((req.user.cart.total - prod.price).toFixed(2));
        return req.user.save();
    }).then(() => {
        res.redirect("/cart");
    });
}

exports.postDeleteCartProduct = (req, res, next) => {
    req.user.cart.items = req.user.cart.items.filter(item => {
        const isDifferentItem = item._id.toString() !== req.body.prodID.toString();
        if (!isDifferentItem) {
            req.user.cart.total = Number((req.user.cart.total - item.total).toFixed(2));
        }
        return isDifferentItem;
    });
    req.user.save().then(() => {
        res.redirect("/cart");
    });
}

exports.postCheckout = (req, res, next) => {
    if (req.user.cart.items.length === 0) {
        return res.redirect("back");
    }
    req.user.populate({
        path: "cart.items._id",
        model: "Product"
    }).then(user => {
        const cart = user.cart;
        const items = cart.items.map(item => {
            return {
                _id: item._id._id,
                title: item._id.title,
                price: item._id.price,
                description: item._id.description,
                imageURL: item._id.imageURL,
                qty: item.qty,
                total: item.total
            }
        });
        let orderTotal = cart.total < 50 ? cart.total + 4.99 : cart.total;
        orderTotal = Number(orderTotal.toFixed(2));
        const order = new Order({
            userId: user._id,
            items: items,
            total: orderTotal
        });
        return order.save();
    }).then(() => {
        req.user.cart = {items: [], total: 0}
        return req.user.save();
    }).then(() => {
        res.redirect("/orders");
    });
}

exports.getOrders = (req, res, next) => {
    Order.updateMany({
            userId: req.user._id,
            deliveryDate: {$lte: new Date()},
            statusCode: 0
        },
        {
            $set: {
                statusCode: 1,
                status: "Delivered"
            }
        }
    ).then(() => {
        return Order.find({userId: req.user._id}).sort({orderDate: -1});
    }).then(orders => {
        res.render("shop/orders", {
            pageTitle: "Your Orders",
            active: "orders",
            orders: orders,
            isLoggedIn: req.session.isLoggedIn
        });
    });
}
