const Product = require('../models/product');
const Order = require('../models/order');


exports.getProducts = (req, res, next) => {
  Product.findAll()
  .then(prods => {
    res.render('shop/product-list', {
      prods,
      pageTitle: 'All Products',
      path: '/products'
    });
  }) 
  .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const {productId} = req.params;
  Product.findByPk(productId)
  .then(product => {
    res.render('shop/product-detail', {
      product,
      pageTitle: 'Product Detail',
      path: '/products' + productId
    });
  })
  .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(prods => {
      res.render('shop/index', {
        prods,
        pageTitle: 'Shop',
        path: '/'
      });
    }) 
    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user.getCart()
  .then(cart => {
    return cart.getProducts();
  })
  .then(products => {
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products
    });
  })
  .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const {productId} = req.body;
  let fetchedCart;
  let newQuantity = 1;
  req.user.getCart()
  .then(cart => {
    fetchedCart = cart;
    return cart.getProducts({ where: { id: productId } });
  })
  .then(products => {
    let product;
    if(products.length > 0) 
      product = products[0];
    if( product ){
      const oldQuantity = product.cartItem.quantity;
      newQuantity = oldQuantity + 1;
      return product;
    }
    return Product.findByPk(productId);
  })
  .then(product => {
    return fetchedCart.addProduct(product, {
      through: { quantity: newQuantity }
    })
    .catch(err => console.log(err));;
  })
  .then(() => {
    res.redirect('/cart');
  })
  .catch(err => console.log(err));
}

exports.postDeleteProductCart = (req, res, next) => {
  const {productId} = req.body;
  req.user.getCart()
  .then(cart => {
    return cart.getProducts({ where: { id: productId } });
  })
  .then(products => {
    const product = products[0];
    return product.cartItem.destroy();
  })
  .then(() => {
    res.redirect('/cart');
  })
  .catch(err => console.log(err));
}

exports.postUpdateQtyProductCart = (req, res, next) => {
  const {productId, qty} = req.body;
  Product.findByPk(productId)
  .then(product => {
    Cart.updateQtyProductCart(productId, product.price, qty);
    res.redirect('/cart');
  })
  .catch(err => console.log(err));
}

exports.postOrder = (req, res, next) => {
  req.user.getCart()
  .then(cart => {
    return cart.getProducts();
  })
  .then(products => { 
    return req.user.createOrder()
    .then(order => {
      return order.addProducts(products.map(product => {
        product.orderItem = { quantity: product.cartItem.quantity };
        return product;
      }));
    })
    .catch(err => console.log(err));
  })
  .then(result => {
    res.redirect('/orders');
  })
  .catch(err => console.log(err));
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
