const User = require('../models/user');
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const joi = require('joi');



const loginSchema = joi.object({
  email: joi.string().email(),
  password: joi.string(),
})


// סעיף 2
router.post('/', async (req, res) => {
  try {
    const validation_error = userSchema.validate(req.body).error;
    if (validation_error) {
      return res.status(400).send('Validation Error!');
    }

    const user = await User.findOne({ email: req.body.email });
    const email = user.email;
    const password = await bcrypt.compare(req.body.password, user.password);

    if (!email || !password) {
      return res.status(400).send('Wrong email or password');
    }

    const { _id, is_business } = user;
    const token = jwt.sign({ _id, is_business }, process.env.JWTKEY);

    res.status(200).send(token);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Server error' });
  }
});



module.exports = router;