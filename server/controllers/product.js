let express = require('express')
let router = express.Router();
let mongoose = require('mongoose')
let jwt = require('jsonwebtoken')
// create a reference to the model
let Product = require('../models/product');
let User = require('../models/user');

module.exports.displayProductList = async (req, res, next) => {
    await Product.find()
              .then((products) => {
                console.log(products);
                  res.render('product', {title: 'Geniuses', ProductList: products, displayName: req.user ? req.user.displayName : ''})
              })
              .catch((err) => {
                res.status(500).send({
                  message: "Something went wrong!!",
                  error: err,
                });
              });
}

module.exports.displayIndividualProduct = async (req, res, next) => {

  const productId = req.params.id;
  await Product.findById(productId)
  .then((product) => {
    console.log(product);
      res.render('product_individual', {title: product.firstName, product, displayName: req.user ? req.user.displayName : ''})
  })
  .catch((err) => {
    res.status(500).send({
      message: "Something went wrong!!",
      error: err,
    });
  });

};

module.exports.addToCart = async (req, res) => {
  const productId = req.params.id;
  const userId = req.user._id; // Assuming you are using authentication and req.user contains the logged-in user's information

  try {
    // Find the product by its ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find the customer by their ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Check if the product already exists in the cart
    const existingProduct = user.cart.cartProducts.find(
      (item) => item.productId.toString() === productId
    );

    if (existingProduct) {
      // If the product exists in the cart, increase the quantity
      existingProduct.quantity += 1;
    } else {
      // If the product does not exist in the cart, add it to the cart
      user.cart.cartProducts.push({ productId: productId, quantity: 1 });
    }

    // Save the updated customer document
    await user.save();

    res.status(200).json({ message: "Product added to cart successfully" });
    res.redirect('/cart');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports.displayAddPage = async (req, res, next) => {

    // console.log(req.user)
     console.log("Add page ok")
    res.render('product_add', {title: 'Add A Talent', displayName: req.user ? req.user.displayName : ''})
}

module.exports.processAddPage = async (req, res, next) => {
    if (!req.body.firstName || !req.body.lastName || !req.body.talent || !req.body.description || !req.body.service || !req.body.price) {
      return res.status(400).send({
        message: "Please enter all necessary information"
      });
    }
    if (req.body.price <=0){
      return res.status(400).send({
        message: "Price cannot be less than 0"
      });     
    }
  
    const newProduct = new Product({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      talent: req.body.talent,
      description: req.body.description,
      service: req.body.service,
      price: req.body.price,
      remarks: req.body.remarks,
      imageName: req.body.imageName
    });
  
    await newProduct.save()
              .then((data) => {
                console.log(data)
                // refresh the contact list
                res.redirect('/product/?addSuccess=true');
                // alert('add popup successful')
              }
                )
                // .then(()=>{
                //   alert('add popup successful')
                // })
              .catch((err) => {
                res.status(500).send({
                  message: "Something went wrong!!",
                  error: err,
                });
              });
}

module.exports.displayUpdatePage = async (req, res, next) => {

    await Product.findById(req.params.id)
    .then((productToUpdate) => {
      console.log(productToUpdate);
      res.render('product_update', {title: 'Update Product', ProductList: productToUpdate, displayName: req.user ? req.user.displayName : ''})
    })
    .catch((err) => {
      res.status(500).send({
        message: "Something went wrong!!",
        error: err,
      });
    });
}

module.exports.processUpdatePage = async (req, res, next) => {

    if (!req.body.firstName || !req.body.lastName || !req.body.talent || !req.body.description || !req.body.service || !req.body.price) {
        return res.status(400).send({
          message: "Please enter all necessary information",
        });
    }
  
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
          req.params.id,
          {
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              talent: req.body.talent,
              description: req.body.description,
              service: req.body.service,
              price: req.body.price,
              remarks: req.body.remarks,
              imageName: req.body.imageName
          },
          { new: true }
      );
// console.log('update ok');
      res.redirect('/product?updateSuccess=true');
      //alert('update ok'); //<--does not work??!
  } catch (err) {
      res.status(500).send({
          message: "Something went wrong!!",
          error: err,
      });
  }
}


module.exports.performDelete = async (req, res, next) => {
    await Product.findByIdAndRemove(req.params.id)
      .then((productToDelete) => {
        res.redirect('/product/?deleteSuccess=true');
        //console.log("ID: " + productToDelete._id + " got deleted!!")
      })
      .catch((err) => {
        res.status(500).send({
          message: "Something went wrong!!",
          error: err,
        });
      });
}