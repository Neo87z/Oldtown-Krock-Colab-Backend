const express = require('express');
const router = express.Router();
const _ = require('underscore');
const ClaimModel = require('../models/ClaimModel');
const ClaimedItems = require('../models/ClaimedModel');
const WeeklyWinners = require('../models/WeeklyWinners');

module.exports = function () {
  // POST route to add a new claim to the database
  router.post('/add-claim', (req, res) => {
    const newClaim = new ClaimModel(req.body);

    newClaim.save()
      .then((savedClaim) => {
        const response = {
          status: true,
          message: 'Claim saved successfully',
          data: savedClaim
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

    const WnewClaim = new WeeklyWinners(req.body);

    WnewClaim.save()
      .then((savedClaim) => {
        const response = {
          status: true,
          message: 'Claim saved successfully',
          data: savedClaim
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

  router.get('/get-all-claims', (req, res) => {
    ClaimModel.find()
      .then(items => {
        console.log('Retrieved items:');
        console.log(items);

        const response = {
          status: true,
          message: 'Retrieved items successfully',
          data: items
        };
        res.status(200).send(response);
      })
      .catch(error => {
        console.error('Error retrieving items:', error);

        const response = {
          status: false,
          message: 'Failed to retrieve items',
          error: error.message
        };
        res.status(500).send(response);
      });
  });

  router.get('/get-weekly-winners', (req, res) => {
    WeeklyWinners.find()
      .then(items => {
        console.log('Retrieved items:');
        console.log(items);

        const response = {
          status: true,
          message: 'Retrieved items successfully',
          data: items
        };
        res.status(200).send(response);
      })
      .catch(error => {
        console.error('Error retrieving items:', error);

        const response = {
          status: false,
          message: 'Failed to retrieve items',
          error: error.message
        };
        res.status(500).send(response);
      });
  });

  router.get('/get-all-claims-MP', (req, res) => {
    ClaimModel.findByClaimLocation('Mount Pearl')
      .then(items => {
        console.log('Retrieved items:');
        console.log(items);

        const response = {
          status: true,
          message: 'Retrieved items successfully',
          data: items
        };
        res.status(200).send(response);
      })
      .catch(error => {
        console.error('Error retrieving items:', error);

        const response = {
          status: false,
          message: 'Failed to retrieve items',
          error: error.message
        };
        res.status(500).send(response);
      });
  });

  router.get('/get-all-claims-FR', (req, res) => {
    ClaimModel.findByClaimLocation('Fresh Water')
      .then(items => {
        console.log('Retrieved items:');
        console.log(items);

        const response = {
          status: true,
          message: 'Retrieved items successfully',
          data: items
        };
        res.status(200).send(response);
      })
      .catch(error => {
        console.error('Error retrieving items:', error);

        const response = {
          status: false,
          message: 'Failed to retrieve items',
          error: error.message
        };
        res.status(500).send(response);
      });
  });

  router.get('/get-all-claims-HG', (req, res) => {
    ClaimModel.findByClaimLocation('Higgins Line')
      .then(items => {
        console.log('Retrieved items:');
        console.log(items);

        const response = {
          status: true,
          message: 'Retrieved items successfully',
          data: items
        };
        res.status(200).send(response);
      })
      .catch(error => {
        console.error('Error retrieving items:', error);

        const response = {
          status: false,
          message: 'Failed to retrieve items',
          error: error.message
        };
        res.status(500).send(response);
      });
  });

  router.post('/claim-item', (req, res) => {
    console.log('jere')
    console.log(req.body)
    const itemId = req.body.ItemID; // Retrieve the item ID from the request body

    ClaimModel.findById(itemId, (err, item) => {
      if (err) {
        console.error('Error retrieving item:', err);
        const response = {
          status: false,
          message: 'Failed to retrieve item',
          error: err.message
        };
        res.status(500).send(response);
        return;
      }

      if (!item) {
        const response = {
          status: false,
          message: 'Item not found',
          error: 'Item does not exist'
        };
        res.status(404).send(response);
        return;
      }

      // Create a new document for claimed items
      const claimedItem = new ClaimedItems({
        FirstName: item.FirstName,
        LastName: item.LastName,
        Email: item.Email,
        Phone: item.Phone,
        ClaimLocation: item.ClaimLocation,
        ClaimDate: item.ClaimDate,
        ClaimableItem: item.ClaimableItem,
        ClaimedDate: new Date().toISOString() // Add ClaimedDate with the current date
      });

      // Save the claimed item to the claimeditems collection
      claimedItem.save((err) => {
        if (err) {
          console.error('Error saving claimed item:', err);
          const response = {
            status: false,
            message: 'Failed to save claimed item',
            error: err.message
          };
          res.status(500).send(response);
          return;
        }

        // Remove the item from the Claims collection
        ClaimModel.findByIdAndRemove(itemId, (err) => {
          if (err) {
            console.error('Error removing item:', err);
            const response = {
              status: false,
              message: 'Failed to remove item',
              error: err.message
            };
            res.status(500).send(response);
            return;
          }

          console.log('Item successfully claimed and removed.');

          const response = {
            status: true,
            message: 'Item successfully claimed and removed.'
          };
          res.status(200).send(response);
        });
      });
    });
  });


  router.post('/reset-weekly-winners', (req, res) => {

    console.log('here')
    WeeklyWinners.deleteMany({}, (error) => {
      if (error) {
        console.error('Error deleting entries:', error);
        res.status(500).send('error');
      } else {
        console.log('All entries deleted successfully.');
        res.status(201).send('ok');
      }
    });

  });

  return router;
};
