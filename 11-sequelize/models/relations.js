const User = require("./user");
const Product = require("./product");
const CartItem = require("./cart-item");
const Order = require("./order");
const OrderItem = require("./order-item");


const setModelRelations = () => {
    User.hasMany(Product);
    User.hasMany(CartItem);
    User.hasMany(Order);
    User.hasMany(OrderItem);

    Product.belongsTo(User);
    Product.hasMany(CartItem);
    Product.belongsToMany(Order, {through: OrderItem});
    Product.hasMany(OrderItem);

    CartItem.belongsTo(User);
    CartItem.belongsTo(Product);

    Order.belongsTo(User);
    Order.belongsToMany(Product, {through: OrderItem});
    Order.hasMany(OrderItem);

    OrderItem.belongsTo(User);
    OrderItem.belongsTo(Product);
    OrderItem.belongsTo(Order);
}

module.exports = setModelRelations;

