const {ObjectId} = require("mongodb");

const Product = require("./product");
const getDb = require("../util/database").getDb;

class User {
    constructor(firstName, lastName, email, id, cart) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this._id = id ? new ObjectId(id) : id;
        this.cart = cart;
    }

    save() {
        const db = getDb();
        return db.collection("users").insertOne(this);
    }

    addCartItem(product) {
        const cartProduct = this.cart.items.find(p =>
            p.productId.toString() === product._id.toString()
        );
        if (cartProduct) {
            cartProduct.qty += 1;
        } else {
            this.cart.items.push({productId: product._id, qty: 1});
        }
        this.cart.total += product.price;
        this.cart.total = Number(this.cart.total.toFixed(2));
        const db = getDb();
        return db.collection("users").updateOne(
            {_id: this._id},
            {$set: {cart: this.cart}}
        );
    }

    static findById(id) {
        const db = getDb();
        return db.collection("users").findOne({_id: new ObjectId(id)});
    }

    getCart() {
        const db = getDb();
        const productIds = this.cart.items.map(item => item.productId);
        return db.collection("products")
            .find({_id: {$in: productIds}})
            .toArray()
            .then(prods => {
                return prods.map(product => {
                    return {
                        ...product,
                        qty: this.cart.items.find(item => {
                            return item.productId.toString() === product._id.toString();
                        }).qty
                    }
                });
            })
            .then(prods => {
                return prods.map(product => {
                    return {
                        ...product,
                        productTotal: Math.round((product.price * product.qty + Number.EPSILON) * 100) / 100
                    }
                })
            })
            .then(prods => {
                return {items: prods, total: this.cart.total}
            });
    }

    deleteCartItemById(id) {
        const prod = this.cart.items.find(item => {
            return item.productId.toString() === id.toString();
        });
        this.cart.items = this.cart.items.filter(item => {
            return item.productId.toString() !== id.toString();
        });
        return Product.findById(id).then(product => {
            this.cart.total -= product.price * prod.qty;
            this.cart.total = Number(this.cart.total.toFixed(2));
            const db = getDb();
            return db.collection("users").updateOne(
                {_id: this._id},
                {$set: {cart: this.cart}}
            );
        })
    }

    reduceCartItemById(id) {
        const prod = this.cart.items.find(item => {
            return item.productId.toString() === id.toString();
        });
        if (prod.qty > 1) {
            prod.qty -= 1;
            return Product.findById(prod.productId)
                .then(product => {
                    this.cart.total -= product.price;
                    this.cart.total = Number(this.cart.total.toFixed(2));
                    const db = getDb();
                    return db.collection("users").updateOne(
                        {_id: this._id},
                        {$set: {cart: this.cart}}
                    );
                });
        } else {
            return this.deleteCartItemById(id);
        }
    }

    addOrder() {
        let orderTotal = this.cart.total < 50 ? this.cart.total + 4.99 : this.cart.total;
        orderTotal = Number(orderTotal.toFixed(2));
        return this.getCart().then(cart => {
            cart.total = orderTotal;
            const db = getDb();
            const orderDate = new Date();
            const deliveryDays = orderDate.getDay() > 3 ? 4 : 3;
            let deliveryDate = new Date(orderDate);
            deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);
            const orderDateString = orderDate.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }).replace(/,/g, "");
            let t = 0;
            const deliveryDateString = deliveryDate.toLocaleString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }).replace(/,/g, match => ++t === 2 ? "" : match);
            return db.collection("orders").insertOne(
                {
                    ...cart,
                    userId: this._id,
                    orderDate: orderDate,
                    deliveryDate: deliveryDate,
                    statusCode: 0,
                    status: "In delivery",
                    orderDateString: orderDateString,
                    deliveryDateString: deliveryDateString
                }
            ).then(() => {
                this.cart = {items: [], total: 0}
                return db.collection("users")
                    .updateOne(
                        {_id: this._id},
                        {$set: {cart: this.cart}}
                    );
            });
        });
    }

    updateOrders() {
        const db = getDb();
        const currentDate = new Date();
        return db.collection("orders").find({
            userId: this._id,
            deliveryDate: {$lte: currentDate},
        })
            .toArray()
            .then(orders => {
                if (orders.length === 0) {
                    return Promise.resolve();
                }
                const updatedOrders = orders.map(order => {
                    order.status = "Delivered " + order.deliveryDateString;
                    order.statusCode = 1;
                    return order;
                });
                return db.collection("orders").bulkWrite(updatedOrders.map(order => ({
                    updateOne: {
                        filter: {_id: order._id},
                        update: {
                            $set: {
                                status: order.status,
                                statusCode: order.statusCode
                            }
                        }
                    }
                })));
            });
    }


    getOrders() {
        return this.updateOrders()
            .then(() => {
                const db = getDb();
                return db.collection("orders")
                    .find({userId: this._id})
                    .sort({orderDate: -1})
                    .toArray();
            });
    }
}

module.exports = User;