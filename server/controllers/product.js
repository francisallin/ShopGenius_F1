let express = require('express')
let router = express.Router();
let mongoose = require('mongoose')

let jwt = require('jsonwebtoken')

// create a reference to the model
let Product = require('../models/product');

module.exports.displayProductList = async (req, res, next) => {
    await Product.find()
              .then((products) => {
                console.log(products);
                  res.render('product', {title: 'Product', ProductList: products, displayName: req.user ? req.user.displayName : ''})
              })
              .catch((err) => {
                res.status(500).send({
                  message: "Something went wrong!!",
                  error: err,
                });
              });
}

module.exports.displayAddPage = async (req, res, next) => {
    // console.log(req.user)
    res.render('product_add', {title: 'Add Product', displayName: req.user ? req.user.displayName : ''})
}

module.exports.processAddPage = async (req, res, next) => {
    if (!req.body.brand || !req.body.model || !req.body.year || !req.body.trim || !req.body.color || !req.body.price) {
      return res.status(400).send({
        message: "Please enter all necessary information",
      });
    }
  
    const newProduct = new Product({
      brand: req.body.brand,
      model: req.body.model,
      year: req.body.year,
      trim: req.body.trim,
      color: req.body.color,
      price: req.body.price
    });
  
    await newProduct.save()
              .then((data) => {
                console.log(data)
                // refresh the contact list
                res.redirect('/product')
              }
                )
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
    if (!req.body.brand || !req.body.model || !req.body.year || !req.body.trim || !req.body.color || !req.body.price) {
        return res.status(400).send({
          message: "Please enter all necessary information",
        });
    }
  
    await Product.findByIdAndUpdate(
      req.params.id,
      {
        brand: req.body.brand,
        model: req.body.model,
        year: req.body.year,
        trim: req.body.trim,
        color: req.body.color,
        price: req.body.price
      },
      { new: true }
    )
      .then((updatedProduct) => {
        console.log(updatedProduct)
        res.redirect('/product')
      })
      .catch((err) => {
        res.status(500).send({
          message: "Something went wrong!!",
          error: err,
        });
      });
}

module.exports.performDelete = async (req, res, next) => {
    await Product.findByIdAndRemove(req.params.id)
      .then((productToDelete) => {
        res.redirect('/product');
        console.log("ID: " + productToDelete._id + " got deleted!!")
      })
      .catch((err) => {
        res.status(500).send({
          message: "Something went wrong!!",
          error: err,
        });
      });
}