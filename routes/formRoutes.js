const express = require('express');
const router = express.Router();
const { submitForm, getOrders } = require('../controllers/formController');

router.post('/contact', submitForm);
router.get('/orders', getOrders);

module.exports = router;
