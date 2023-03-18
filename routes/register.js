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
});


// סעיף 1
router.post('/', async (req, res) => {
  try {
    const validation_error = userSchema.validate(req.body).error;
    if (validation_error) {
      return res.status(400).send('Wrong body');
    }

    const email_conflict = await User.findOne({ email: req.body.email });
    if (email_conflict) {
      return res.status(409).send('Email already in use');
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    const new_user = new User({
      name: req.body.name,
      email: req.body.email,
      password,
      is_business: false
    });
    await new_user.save();

    const { _id, is_business } = new_user;
    const token = jwt.sign({ _id, is_business }, process.env.JWTKEY);

    res.status(200).send(token);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Server error' });
  }
})



module.exports = router;