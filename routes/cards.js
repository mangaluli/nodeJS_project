const auth = require('../middleware/auth');
const Card = require('../models/card');
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const joi = require('joi');



const cardSchema = joi.object({
  name: joi.string().min(1).max(255),
  description: joi.string().min(1).max(255),
  address: joi.string().min(1).max(255),
  phone: joi.string().min(4).max(20),
  image_url: joi.string(),
})


// סעיף 4
router.post('/', auth, async (req, res) => {
  try {
    const is_business = req.payload.is_business;

    if (!is_business) {
      return res.status(403).send('Only business users can Cards');
    }

    const validation_error = cardSchema.validate(req.body).error;
    if (validation_error) {
      return res.status(400).send('Wrong body');
    }

    const user_id = req.payload._id;
    const card = new Card({ ...req.body, user_id });
    await card.save();

    res.status(201).send('Card created successfully');
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Server error' });
  }
});

// סעיף 5
router.get('/:card_id', auth, async (req, res) => {
  try {
    const { _id, is_business } = req.payload;
    const card = Card.findById(req.params.card_id);

    if (!card) {
      return res.status(404).send('Card not found');
    }

    const card_belongs_to_user = _id !== card.user_id

    if (!is_business || !card_belongs_to_user) {
      return res.status(403).send('Authorization error');
    }

    res.status(200).send(card);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Server error' });
  }
});

// סעיף 6
router.put('/:card_id', auth, async (req, res) => {
  try {
    const { _id, is_business } = req.payload;
    const card_id = req.params.card_id;
    const card = Card.findById(card_id);

    if (!card) {
      return res.status(404).send('Card not found');
    }

    const card_belongs_to_user = _id !== card.user_id

    if (!is_business || !card_belongs_to_user) {
      return res.status(403).send('Authorization error');
    }

    await card.updateOne(req.body);

    res.status(200).send('Update successfull');
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Server error' });
  }
});

// סעיף 7
router.delete('/:card_id', auth, async (req, res) => {
  try {
    const { _id, is_business } = req.payload;
    const card_id = req.params.card_id;
    const card = Card.findById(card_id);

    if (!card) {
      return res.status(404).send('Card not found');
    }

    const card_belongs_to_user = _id !== card.user_id

    if (!is_business || !card_belongs_to_user) {
      return res.status(403).send('Authorization error');
    }

    await card.deleteOne();

    res.status(200).send('Delete successfull');
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Server error' });
  }
});

// סעיף 8
router.get('/', auth, async (req, res) => {
  try {
    const { _id, is_business } = req.payload;

    if (!is_business) {
      return res.status(403).send('Authorization error');
    }

    const cards = Card.find({ user_id: _id });

    if (!cards) {
      return res.status(404).send('No cards found');
    }

    res.status(200).send(cards);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Server error' });
  }
});

module.exports = router;