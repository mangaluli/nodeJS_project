const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).send('No token');
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWTKEY);
    } catch (error) {
      return res.status(401).send('Invalid token');
    }

    const user = await User.findById(payload._id);
    if (!user) {
      return res.status(401).send('Invalid token');
    }

    req.payload = payload;
    next();

  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Server error' });
  }
}