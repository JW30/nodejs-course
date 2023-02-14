const db = require("../util/database");

module.exports = class Cart {

    static addProduct(userId, prodId) {
        return db.query("INSERT INTO carts " +
            "VALUES (?, ?, 1) " +
            "ON DUPLICATE KEY UPDATE qty=qty+1;", [userId, prodId]);
    }

    static getOrderValueByUserId(userId) {
        return db.query("SELECT sum(price * qty) as orderValue " +
            "FROM carts INNER JOIN products " +
            "ON carts.prod_id=products.id;");
    }

    static reduceProduct(userId, prodId) {
        return db.query("DELETE FROM carts WHERE user_id=? AND prod_id=? AND qty=1;", [userId, prodId]).then(() => {
            return db.query("UPDATE carts SET qty=qty-1 WHERE user_id=? AND prod_id=?;", [userId, prodId]);
        });
    }

    static deleteProduct(userId, prodId) {
        return db.query("DELETE FROM carts WHERE user_id=? AND prod_id=?;", [userId, prodId]);
    }

    static getAll(userId) {
        return db.query("SELECT *, qty * price as total " +
            "FROM carts INNER JOIN products " +
            "ON carts.prod_id=products.id " +
            "WHERE user_id=?", [userId]);
    }
}