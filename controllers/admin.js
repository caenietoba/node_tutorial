const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const {title, imageUrl, price, description} = req.body;
  req.user.createProduct({
    title,
    description,
    price,
    imageUrl
  }).then(result => res.redirect('/admin/products'))
  .catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const {edit} = req.query;
  if(!edit) 
    res.redirect('/');
  const {productId} = req.params;
  req.user.getProducts({ where: { id: productId } })
  //Product.findById(productId)
  .then(products => {
    const product = products[0];
    if(!product){
      return res.redirect('/');
    }
    console.log(product);
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      product
    });
  })
  .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const {productId, title, price, imageUrl, description} = req.body;
  const updatedProduct = new Product(productId, title, imageUrl, description, price);
  Product.update(req.body, {where: {id: productId}})
  .then(results => {
    res.redirect('/admin/products');
  })
  .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  req.user.getProducts()
  //Product.findAll()
    .then(result => {
      console.log(result);
      res.render('admin/products', {
        prods: result,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    }) 
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.destroy({where: {id: productId}})
  .then(result => {
    res.redirect('/admin/products');
  })
  .catch(err => console.log(err));
};
