const express = require('express');

const routes = express.Router();

// SubscriptionController
const subscriptionController = require('../controllers/subscriptionController');

// PurchaseRoutes
routes.use('/purchase', require('../routes/purchaseRoutes'))

module.exports = routes