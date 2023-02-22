const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const OrderItem = sequelize.define("orderItem", {
    orderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
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

module.exports = OrderItem;