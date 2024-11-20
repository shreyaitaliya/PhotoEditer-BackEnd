const express = require('express');

const routes = express.Router();

// PurchaseController
const PurchaseController = require('../controllers/purchaseController')

// Routes
routes.post('/', PurchaseController.AddPurchase);

module.exports = routes