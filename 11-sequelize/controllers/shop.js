const Product = require("../models/product");
const CartItem = require("../models/cart-item");
const OrderItem = require("../models/order-item");
const sequelize = require("../util/database");

function transformOrders(orders) {
    // Add formatted order date and delivery date to the order objects
    return orders.map(order => {
        let orderDate = new Date(order.createdAt);
        orderDate = orderDate.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        }).replace(",", "");
        let deliveryDate = new Date(order.createdAt);
        deliveryDate.setDate(deliveryDate.getDate() + (deliveryDate.getDay() > 3 ? 4 : 3));
        let t = 0;
        deliveryDate = deliveryDate.toLocaleString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
            year: "numeric"
        }).replace(/,/g, match => ++t === 2 ? "" : match);
        const statusCode = new Date() < new Date(deliveryDate) ? 0 : 1;
        const status = statusCode === 0 ? "In delivery" : "Delivered " + deliveryDate;
        return {
            ...order,
            orderDate: orderDate,
            deliveryDate: deliveryDate,
            statusCode: statusCode,
            status: status
        }
    });
}

exports.getIndex = (req, res, next) => {
    res.render("shop/index", {
        pageTitle: "Shop - Home"
    });
}

exports.getProducts = (req, res, next) => {
    Product.findAll().then(prods => {
        res.render("shop/products", {
            prods: prods,
            pageTitle: "All Products",
            active: "products"
        });
    });
}

exports.getDetails = (req, res, next) => {
    const prodID = req.params.prodID;
    Product.findByPk(prodID).then(prod => {
        res.render("shop/product-details", {
            pageTitle: "Shop: " + prod.title,
            prod: prod
        });
    });
}

exports.getCart = (req, res) => {
    req.user.getCartItems({
        include: [{
            model: Product,
            required: true
        }]
    }).then(cartItems => {
        let cartTotal = cartItems.reduce((acc, cartItem) => {
            return acc + (cartItem.product.price * cartItem.qty);
        }, 0);
        cartTotal = Math.round((cartTotal + Number.EPSILON) * 100) / 100;
        res.render("shop/cart", {
            cartItems: cartItems,
            cartTotal: cartTotal,
            active: "cart"
        });
    });
}

exports.postCart = (req, res) => {
    req.user.getCartItems({
        where: {
            productId: req.body.prodID
        }
    }).then(cartItems => {
        if (cartItems.length > 0) {
            return cartItems[0].update({
                qty: sequelize.literal("qty + 1")
            });
        } else {
            return req.user.createCartItem({
                productId: req.body.prodID,
                qty: 1
            });
        }
    }).then(() => res.redirect("/cart"));
}

exports.postReduceCartProduct = (req, res, next) => {
    const prodID = req.body.prodID;
    req.user.getCartItems({
        where: {
            productID: prodID
        }
    }).then(cartItems => {
        const cartItem = cartItems[0];
        if (cartItem.qty === 1) {
            return cartItem.destroy({force: true});
        } else {
            return cartItem.update({
                qty: sequelize.literal("qty - 1")
            });
        }
    }).then(() => {
        res.redirect("/cart");
    });
}

exports.postDeleteCartProduct = (req, res, next) => {
    const prodID = req.body.prodID;
    CartItem.destroy({
        where: {userId: req.user.id, productId: prodID},
        force: true
    }).then(() => {
        res.redirect("/cart");
    });
}

exports.getCheckout = (req, res, next) => {
    res.render("shop/checkout", {
        pageTitle: "Checkout"
    });
}

exports.postCheckout = (req, res, next) => {
    const cartItems = JSON.parse(req.body.cartItems);
    CartItem.destroy(
        {
            where: {userId: req.user.id},
            force: true
        }).then(() => {
        req.user.createOrder({total: req.body.cartTotal})
            .then(result => {
                const orderId = result.id;
                const orderPromises = [];
                for (const cartItem of cartItems) {
                    orderPromises.push(
                        req.user.createOrderItem({
                            orderId: orderId,
                            productId: cartItem.productId,
                            qty: cartItem.qty
                        }));
                }
                return Promise.all(orderPromises);
            }).then(() => {
            res.redirect("/orders");
        });
    });
}

exports.getOrders = (req, res, next) => {
    req.user.getOrders({
        include: [{
            model: OrderItem,
            required: true,
            include: {
                model: Product,
                required: true
            }
        }],
        order : [["createdAt", "DESC"]]
    }).then(orders => {
        res.render("shop/orders", {
            pageTitle: "Your Orders",
            active: "orders",
            orders: transformOrders(orders)
        });
    });
}
