const express = require('express');
const router = express.Router();

const currencyController = require('../controllers/CurrencyController');

router.post('/', currencyController.currencyConvert); 

module.exports = router;