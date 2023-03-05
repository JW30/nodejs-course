const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            qty: {
                type: Number,
                required: true
            },
            total: {
                type: Number,
                required: true
            }
        }],
        total: {
            type: Number,
            required: true
        }
    }
});

module.exports = mongoose.model("User", userSchema);