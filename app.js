const express = require('express');
const mongoose = require('mongoose');
const { usersRoutes } = require('./routes/users');
const { cardsRoutes } = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
// const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '6279288c0b313ae29650f646',
  };

  next();
});

// app.use(auth);
app.post('/signin', express.json(), login);
app.post('/signup', express.json(), createUser);

app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);

app.use((req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`App listening on port ${PORT}`);
  });
}

main();
