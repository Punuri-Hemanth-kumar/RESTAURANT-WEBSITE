const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please enter password'],
    minlength: [6, 'Minimum 6 characters']
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

schema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

schema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) return user;
    throw Error('Incorrect Password');
  }
  throw Error('Incorrect Email');
};

module.exports = mongoose.model('user', schema);
