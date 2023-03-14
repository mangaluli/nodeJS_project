const express = require('express');
require('dotenv').config();

const logger = require('./middleware/logger');
const mongoose = require('mongoose');
const PORT = process.env.PORT;
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
app.use(logger);

const register = require('./routes/register');
const profile = require('./routes/profile');
const cards = require('./routes/cards');
const login = require('./routes/login');
app.use('/api/register', register);
app.use('/api/profile', profile);
app.use('/api/cards', cards);
app.use('/api/login', login);



mongoose
  .connect(process.env.DB, { useNewUrlParser: true })
  .then(() => console.log("Mongoose connection established. Standing by."))
  .catch(error => {
    console.log('')
    console.log(error);
  });

app.listen(PORT, () => console.log(`Port ${PORT} active, Node server standing by.`));