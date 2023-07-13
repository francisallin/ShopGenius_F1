let express = require('express')
let router = express.Router();
let mongoose = require('mongoose')

let jwt = require('jsonwebtoken')

// create a reference to the model
let List = require('../models/contact');

module.exports.displayContactList = async (req, res, next) => {
    await List.find()
              .then((lists) => {
                console.log(lists);
                  res.render('list', {title: 'Business Contact List', ContactList: lists, displayName: req.user ? req.user.displayName : ''})
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
    res.render('add', {title: 'Add Contact', displayName: req.user ? req.user.displayName : ''})
}

module.exports.processAddPage = async (req, res, next) => {
    if (!req.body.name || !req.body.email || !req.body.phone) {
      return res.status(400).send({
        message: "Name or email or phone can't be empty",
      });
    }
  
    const newContact = new List({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone
    });
  
    await newContact.save()
              .then((data) => {
                console.log(data)
                // refresh the contact list
                res.redirect('/contact-list')
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

    await List.findById(req.params.id)
    .then((contactToUpdate) => {
      console.log(contactToUpdate);
      res.render('update', {title: 'Update Contact', ContactList: contactToUpdate, displayName: req.user ? req.user.displayName : ''})
    })
    .catch((err) => {
      res.status(500).send({
        message: "Something went wrong!!",
        error: err,
      });
    });
}

module.exports.processUpdatePage = async (req, res, next) => {
    if (!req.body.name || !req.body.email || !req.body.phone) {
      return res.status(400).send({
        message: "Name or email or phone can't be empty",
      });
    }
  
    await List.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
      },
      { new: true }
    )
      .then((updatedContact) => {
        console.log(updatedContact)
        res.redirect('/contact-list')
      })
      .catch((err) => {
        res.status(500).send({
          message: "Something went wrong!!",
          error: err,
        });
      });
}

module.exports.performDelete = async (req, res, next) => {
    await List.findByIdAndRemove(req.params.id)
      .then((contactToDelete) => {
        res.redirect('/contact-list');
        console.log("ID: " + contactToDelete._id + " got deleted!!")
      })
      .catch((err) => {
        res.status(500).send({
          message: "Something went wrong!!",
          error: err,
        });
      });
}