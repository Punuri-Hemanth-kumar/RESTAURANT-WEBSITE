const jwt = require('jsonwebtoken');
const User = require('../models/user'); // make sure user model has `isAdmin` field

// Middleware to protect general routes
const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, 'murali secretcode', (err, decodedToken) => {
      if (err) {
        console.log('Auth error:', err.message);
        return res.redirect('/login');
      } else {
        req.user = decodedToken; // add decoded data to request
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
};

// Middleware to check user and attach to res.locals (optional)
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, 'murali secretcode', async (err, decodedToken) => {
      if (!err) {
        const user = await User.findById(decodedToken.id);
        res.locals.user = user;
      } else {
        res.locals.user = null;
      }
      next();
    });
  } else {
    res.locals.user = null;
    next();
  }
};

// Middleware to restrict access to admins only
const isAdmin = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, 'murali secretcode', async (err, decoded) => {
      if (err) {
        console.log('Admin token error:', err.message);
        return res.redirect('/adminLogin');
      }

      try {
        const admin = await User.findById(decoded.id);
        if (admin && admin.isAdmin) {
          req.user = admin;
          next();
        } else {
          res.status(403).send('Access Denied: Not an admin');
        }
      } catch (e) {
        console.log('DB error:', e.message);
        res.redirect('/adminLogin');
      }
    });
  } else {
    res.redirect('/adminLogin');
  }
};

const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, 'murali secretcode', (err, decodedToken) => {
      if (err) {
        return res.redirect('/adminLogin');
      } else {
        req.user = decodedToken;
        next();
      }
    });
  } else {
    res.redirect('/adminLogin');
  }
};


module.exports = { requireAuth, checkUser, isAdmin, verifyToken };
