const express = require('express');
const router = express.Router();
const _ = require('underscore');
const ClaimModel = require('../models/ClaimModel');

module.exports = function () {
  // POST route to add a new claim to the database
  router.post('/add-claim', (req, res) => {
    const newClaim = new ClaimModel(req.body);
    
    newClaim.save()
      .then(() => {
        const response = {
          status: true,
          message: 'Claim saved successfully',
          data: newClaim
        };
        res.status(201).send(response);
      })
      .catch((error) => {
        console.error(error);
        const response = {
          status: false,
          message: 'Failed to save claim',
          error: error.message
        };
        res.status(500).send(response);
      });
  });

  return router;
};