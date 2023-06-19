const express = require('express');
const router = express.Router();
const UserModel = require('../models/UserModel');

module.exports = function () {
  // POST route to create a new user
  router.post('/create-user', (req, res) => {
    const newUser = new UserModel(req.body);

    newUser.save()
      .then(() => {
        const response = {
          status: true,
          message: 'User created successfully',
          data: newUser
        };
        res.status(201).send(response);
      })
      .catch((error) => {
        console.error(error);
        const response = {
          status: false,
          message: 'Failed to create user',
          error: error.message
        };
        res.status(500).send(response);
      });
  });

  return router;
};

