const express = require("express");
const router = express.Router();
const { submitForm, getOrders } = require("../controllers/formController");

// POST /api/contact
router.post("/contact", submitForm);

// GET /api/orders
router.get("/orders", getOrders);

module.exports = router;
