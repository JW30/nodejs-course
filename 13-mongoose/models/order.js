const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    orderDate: {
        type: Date,
        default: Date.now(),
        required: true
    },
    orderDateString: {
        type: String,
        default: function () {
            return this.orderDate.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }).replace(/,/g, "");
        },
        required: true
    },
    deliveryDate: {
        type: Date,
        default: function () {
            const deliveryDays = this.orderDate.getDay() > 3 ? 4 : 3;
            let deliveryDate = new Date(this.orderDate);
            deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);
            return deliveryDate;
        },
        required: true
    },
    deliveryDateString: {
        type: String,
        default: function () {
            let t = 0;
            return this.deliveryDate.toLocaleString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }).replace(/,/g, match => ++t === 2 ? "" : match);
        },
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    statusCode: {
        type: Number,
        required: true,
        default: 0
    },
    status: {
        type: String,
        required: true,
        default: "In delivery"
    },
    items: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        title: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        imageURL: {
            type: String,
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
});

module.exports = mongoose.model("Order", orderSchema);