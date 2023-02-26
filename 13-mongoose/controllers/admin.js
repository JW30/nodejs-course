const Product = require("../models/product");

exports.getAdminProducts = (req, res) => {
    Product.find({ userId: req.user._id }).then(prods => {
        console.log(prods);
        res.render('admin/admin-products', {
            prods: prods,
            pageTitle: 'Admin Products',
            active: "admin-products"
        });
    });
}

exports.getAddProduct = (req, res) => {
    res.render('admin/add-product', {
        pageTitle: 'Add Product',
        active: "add-product"
    });
};

exports.postAddProduct = (req, res) => {
    const price = Number(parseFloat(req.body.price).toFixed(2));
    const product = new Product({
        title: req.body.title,
        price: price,
        description: req.body.description.replace(/\n/g, "<br />"),
        imageURL: req.body.imageURL,
        userId: req.user._id
    });
    product.save().then(() => {
        res.redirect('/products');
    });
};

exports.getEditProduct = (req, res) => {
    Product.findById(req.params.prodID)
        .then(prod => {
            res.render("admin/edit-product", {
                pageTitle: "Edit: " + prod.title,
                prod: prod
            });
        });
}

exports.postEditProduct = (req, res) => {
    const price = Number(parseFloat(req.body.price).toFixed(2));
    Product.findByIdAndUpdate(req.body.id, {
        title: req.body.title,
        price: price,
        description: req.body.description.replace(/\n/g, "<br />"),
        imageURL: req.body.imageURL
    }).then(() => {
        res.redirect("/admin/products");
    });
}

exports.postDeleteProduct = (req, res) => {
    Product.deleteOne({_id: req.params.prodID})
        .then(() => {
            res.redirect("/admin/products")
        });
}