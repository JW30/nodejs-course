const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const CartItem = sequelize.define("cartItem", {
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    qty: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
});

module.exports = CartItem;