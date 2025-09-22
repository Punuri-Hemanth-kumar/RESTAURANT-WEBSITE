const express = require('express');
const Order=require('../models/order')
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/authentication');
const control = require('../controllers/contrrol');

// Admin login page
router.get('/adminLogin', (req, res) => {
  res.render('adminLogin');  // File should be views/admin-login.ejs
});

// Admin login POST handler
router.post('/adminLogin', control.admin_login_post);

// Admin dashboard (protected route)
router.get('/dashboard', verifyToken, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find(); // Get all orders
    res.render('dashboard', {
      admin: req.user,
      orders  // ✅ this must match the variable name used in EJS
    });
  } catch (error) {
    console.error("Failed to load orders:", error);
    res.status(500).send("Error loading dashboard");
  }
});

module.exports = router;
