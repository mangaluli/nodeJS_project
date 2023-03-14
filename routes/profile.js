const auth = require('../middleware/auth');
const User = require('../models/user');
const express = require('express');
const router = express.Router();


// סעיף 3
router.get('/', auth, async (req, res) => {
  try {
    let user = await User.findById({ _id: req.payload._id });
    if (!user) {
      return res.status(404).send('No user with such ID');
    }

    const { _id, email, name, is_business } = user;

    res.status(200).send({ _id, email, name, is_business });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Server error' });
  }
});



module.exports = router;