const User = require('../models/user');
const Order = require('../models/order');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const maxTime = 3 * 24 * 60 * 60;
const createToken = (id) => jwt.sign({ id }, 'murali secretcode', { expiresIn: maxTime });

module.exports.admin_login_get = (req, res) => {
  res.render('admin-login');
};

module.exports.admin_login_post = async (req, res) => {
  const { email, password } = req.body;
  const admin = await User.findOne({ email });

  if (!admin || !admin.isAdmin) {
    return res.render('admin-login', { error: 'Access denied. Admins only.' });
  }

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.render('admin-login', { error: 'Invalid password' });

  const token = createToken(admin._id);
  res.cookie('jwt', token, { httpOnly: true, maxAge: maxTime * 1000 });
  res.redirect('/admin/dashboard');
};

module.exports.dashboard_get = async (req, res) => {
  const admin = req.user;
  const orders = await Order.find().sort({ orderTime: -1 });
  res.render('admin-dashboard', { admin, orders });
};
