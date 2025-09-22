const express = require('express');
const mongoose = require('mongoose');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, isAdmin,checkUser } = require('./middleware/authentication');

const app = express();

app.use(express.json()); 
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

const url = 'mongodb+srv://nodeauth:node1234@node.s5dqwil.mongodb.net/Murali';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(3000, () => {
      console.log("Connected to MongoDB & server is running on http://localhost:3000");
    });
  })
  .catch(err => {
    console.log("MongoDB connection error:", err);
  });

// middleware to apply to all GET requests
app.get('*', checkUser);

// Home routes
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));

// Custom routes
app.use(adminRoutes);
app.use(userRoutes);
