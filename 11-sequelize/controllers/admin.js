const Product = require("../models/product");

exports.getAdminProducts = (req, res) => {
    req.user.getProducts().then(prods => {
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
    req.user.createProduct({
        title: req.body.title,
        price: price,
        description: req.body.description.replace(/\n/g, "<br />"),
        imageURL: req.body.imageURL
    }).then(() => {
        res.redirect('/products');
    });
};

exports.getEditProduct = (req, res) => {
    const prodID = req.params.prodID;
    req.user.getProducts({
        where: {
            id: prodID
        }
    }).then(prods => {
        const prod = prods[0];
        res.render("admin/edit-product", {
            pageTitle: "Edit: " + prod.title,
            prod: prod
        });
    });
}

exports.postEditProduct = (req, res) => {
    const price = Number(parseFloat(req.body.price).toFixed(2));
    Product.update({
        title: req.body.title,
        description: req.body.description.replace(/\n/g, "<br />"),
        price: price,
        imageURL: req.body.imageURL
    }, {
        where: {id: req.body.id}
    }).then(() => {
        res.redirect("/admin/products");
    });
}

exports.postDeleteProduct = (req, res) => {
    const prodID = req.params.prodID;
    Product.destroy({
        where: {
            id: prodID
        },
        force: true
    }).then(() => {
        res.redirect("/admin/products")
    });
}