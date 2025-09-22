const person = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Error handler
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  if (err.message === 'Incorrect Email') {
    errors.email = 'Email not registered';
  }

  if (err.message === 'Incorrect Password') {
    errors.password = 'Password is incorrect';
  }

  if (err.code === 11000) {
    errors.email = 'Email already exists';
    return errors;
  }

  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

// JWT helper
const maxTime = 7 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'murali secretcode', {
    expiresIn: maxTime
  });
};

// Signup GET
module.exports.signup_get = (req, res) => {
  res.render('signup');
};

// Login GET
module.exports.login_get = (req, res) => {
  res.render('login');
};

// Signup POST
module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const member = await person.create({ email, password });
    const token = createToken(member._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxTime * 1000 });
    res.status(200).json({ member: member._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

// Login POST
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await person.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxTime * 1000 });
    res.status(200).json({ member: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

// Logout
module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
};

// About Page
module.exports.about_get = (req, res) => {
  res.render('about');
};

// Menu Page
module.exports.menu_get = (req, res) => {
  res.render('menu');
};

// Admin Login POST
module.exports.admin_login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await person.findOne({ email });

    if (!admin || !admin.isAdmin) {
      return res.render('adminLogin', { error: 'Admin not found or not authorized' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.render('adminLogin', { error: 'Incorrect password' });
    }

    const token = jwt.sign({ id: admin._id }, 'murali secretcode', { expiresIn: '1h' });
    res.cookie('jwt', token, { httpOnly: true, maxAge: 1 * 60 * 60 * 1000 }); // 1 hour
    res.redirect('dashboard');

  } catch (err) {
    console.error(err);
    res.render('adminLogin', { error: 'Something went wrong' });
  }

const Order = require('../models/order');


// Create order - user places an order
exports.placeOrder_post = async (req, res) => {
  try {
    const { items } = req.body;
    const username = res.locals.user.email; // assuming user is logged in and available via JWT middleware
    const newOrder = new Order({ username, items });
    await newOrder.save();
    res.redirect('/menu'); // or wherever you want
  } catch (err) {
    console.error(err);
    res.status(500).send('Error placing order');
  }
};

// Admin dashboard
exports.admin_dashboard = async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderTime: -1 });
    res.render('adminDashboard', { admin: res.locals.user, orders });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to load dashboard');
  }
};


};
