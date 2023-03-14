const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
  image_url: {
    type: String,
  }
});

const Card = mongoose.model('cards', cardSchema);
module.exports = Card;