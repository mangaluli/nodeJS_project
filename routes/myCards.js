const auth = require('../middleware/auth');
const Card = require('../models/card');
const express = require('express');
const router = express.Router();

// סעיף 8
router.get('/', auth, async (req, res) => {
  try {
    const { _id, is_business } = req.payload;

    if (!is_business) {
      return res.status(403).send('Only business users can manipulate Cards');
    }

    const cards = await Card.find({ user_id: _id });

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