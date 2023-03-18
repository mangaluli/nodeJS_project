const auth = require('../middleware/auth');
const Card = require('../models/card');
const express = require('express');
const router = express.Router();
const joi = require('joi');



const cardSchema = joi.object({
  name: joi.string().required().min(1).max(255),
  description: joi.string().min(1).max(255),
  address: joi.string().min(1).max(255),
  phone: joi.string().min(4).max(20),
  image_url: joi.string(),
})


// סעיף 4
router.post('/', auth, async (req, res) => {
  try {
    const is_business = req.payload.is_business;
    const user_id = req.payload._id;

    if (!is_business) {
      return res.status(403).send('Only business users can manipulate Cards');
    }

    const validation_error = cardSchema.validate(req.body).error;
    if (validation_error) {
      return res.status(400).send('Wrong body');
    }

    const card = new Card({ ...req.body, user_id });
    await card.save();

    res.status(201).send(card);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Server error' });
  }
});

// סעיף 5
router.get('/:card_id', auth, async (req, res) => {
  try {
    const card_id = req.params.card_id;

    const valid_id = card_id.length === 24;
    if (!valid_id) {
      return res.status(400).send('Invalid id');
    }

    const { _id, is_business } = req.payload;
    if (!is_business) {
      return res.status(403).send('Only business users can manipulate Cards');
    }

    const card = await Card.findById(card_id);
    if (!card) {
      return res.status(404).send('Card not found');
    }

    console.log('user_id: ' + _id, 'card_user_id: ' + card.user_id);
    const card_belongs_to_user = _id === card.user_id
    if (!card_belongs_to_user) {
      return res.status(403).send('This card doesnt belong to you');
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
    const card_id = req.params.card_id;

    const valid_id = card_id.length === 24;
    if (!valid_id) {
      return res.status(400).send('Invalid id');
    }

    const validation_error = cardSchema.validate(req.body).error;
    if (validation_error) {
      return res.status(400).send('Wrong body');
    }

    const { _id, is_business } = req.payload;
    if (!is_business) {
      return res.status(403).send('Only business users can manipulate Cards');
    }

    const card = await Card.findById(card_id);
    if (!card) {
      return res.status(404).send('Card not found');
    }

    const card_belongs_to_user = _id === card.user_id
    if (!card_belongs_to_user) {
      return res.status(403).send('This card doesnt belong to you');
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
    const card_id = req.params.card_id;

    const valid_id = card_id.length === 24;
    if (!valid_id) {
      return res.status(400).send('Invalid id');
    }

    const { _id, is_business } = req.payload;
    if (!is_business) {
      return res.status(403).send('Only business users can manipulate Cards');
    }

    const card = await Card.findById(card_id);
    if (!card) {
      return res.status(404).send('Card not found');
    }

    const card_belongs_to_user = _id !== card.user_id
    if (!card_belongs_to_user) {
      return res.status(403).send('This card doesnt belong to you');
    }

    await card.deleteOne();

    res.status(200).send('Delete successfull');
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Server error' });
  }
});

// סעיף 9
router.get('/', auth, async (req, res) => {
  try {
    const cards = await Card.find();

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