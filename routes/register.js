const User = require('../models/user');
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const joi = require('joi');



const userSchema = joi.object({
  email: joi.string().required().min(5).max(255).email(),
  password: joi.string().required().min(8).max(255),
  name: joi.string().required().min(2).max(255),
  is_business: joi.boolean().required(),
});


// סעיף 1
router.post('/', async (req, res) => {
  try {
    //
    const validation_error = userSchema.validate(req.body).error;
    if (validation_error) {
      return res.status(400).send('Validation Error!');
    }

    let email_unavailable = await User.findOne({ email: req.body.email });
    if (email_unavailable) {
      return res.status(409).send('Email already in use');
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    new_user = new User({ ...req.body, password });
    await new_user.save();

    res.status(201).send('Registration successfull');
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Server error' });
  }
})



module.exports = router;