const express = require('express');
const control = require('../controllers/contrrol');
const router = express.Router();

router.get('/signup', control.signup_get);
router.post('/signup', control.signup_post);
router.get('/login', control.login_get);
router.post('/login', control.login_post);
router.get('/logout', control.logout_get);
router.get('/about-us', control.about_get);
router.get('/menu', control.menu_get);

router.get('/typesBiryani', (req, res) => res.render('typesBiryani'));
router.get('/typesMeals', (req, res) => res.render('typesMeals'));
router.get('/typesStarters', (req, res) => res.render('typesStarters'));
router.get('/typesBurgers', (req, res) => res.render('typesBurgers'));
router.get('/typesMilkshakes', (req, res) => res.render('typesMilkshakes'));
router.get('/typesDesserts', (req, res) => res.render('typesDesserts'));
const Order = require('../models/order');
const { requireAuth } = require('../middleware/authentication');

// Order placing POST route
router.post('/place-order', requireAuth, async (req, res) => {
  const user = req.user;
  const { items } = req.body; // e.g., ["Pizza", "Burger"]

  try {
    await Order.create({
      username: user.email,
      items: items
    });
    res.redirect('/smoothies'); // or a success page
  } catch (err) {
    console.error(err);
    res.status(500).send("Error placing order");
  }
});

module.exports = router;
