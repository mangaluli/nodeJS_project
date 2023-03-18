const User = require('../models/user');
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const joi = require('joi');



const userSchema = joi.object({
  email: joi.string().required().email(),
  password: joi.string().required(),
})


// סעיף 2
router.post('/', async (req, res) => {
  try {
    const validation_error = userSchema.validate(req.body).error;
    if (validation_error) {
      return res.status(400).send('Wrong body');
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).send('Wrong email or password');
    }

    const passwords_match = await bcrypt.compare(req.body.password, user.password);
    if (!passwords_match) {
      return res.status(401).send('Wrong email or password');
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