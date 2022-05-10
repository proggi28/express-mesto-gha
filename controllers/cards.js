const Card = require('../models/card');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch (err) {
    res.status(500).send({
      message: 'Произошла ошибка на сервере',
    });
  }
};

const createCard = async (req, res) => {
  try {
    const card = new Card({
      name: req.body.name,
      link: req.body.link,
      owner: req.user._id,
    });
    res.status(201).send(await card.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({
        message: 'Переданы некорректные данные при создании карточки',
      });
      return;
    }
    res.status(500).send({
      message: 'Произошла ошибка в работе сервера',
    });
  }
};

const deleteCardById = async (req, res) => {
  try {
    const cardById = await Card.findByIdAndRemove(req.params.cardId);
    if (!cardById) {
      const error = new Error('Карточка не найдена');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).send(cardById);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({
        message: 'Переданы некорректные данные',
      });
      return;
    }
    if (err.statusCode === 404) {
      res.status(404).send({
        message: 'Карточка не найдена',
      });
      return;
    }
    res.status(500).send({
      message: 'Произошла ошибка на сервере',
    });
  }
};

const likeCard = async (req, res) => {
  try {
    const addLikeCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    );
    if (!addLikeCard) {
      const error = new Error('Карточка не найдена');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).send(addLikeCard);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({
        message: 'Переданы некорректные данные для постановки лайка',
      });
      return;
    }
    if (err.statusCode === 404) {
      res.status(404).send({
        message: 'Карточка не найдена',
      });
      return;
    }
    res.status(500).send({
      message: 'Произошла ошибка на сервере',
    });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const addDislikeCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    );
    if (!addDislikeCard) {
      const error = new Error('Карточка не найдена');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).send(addDislikeCard);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({
        message: 'Переданы некорректные данные для снятия лайка',
      });
      return;
    }
    if (err.statusCode === 404) {
      res.status(404).send({
        message: 'Карточка не найдена',
      });
      return;
    }
    res.status(500).send({
      message: 'Произошла ошибка на сервере"',
    });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
