const res = require("express/lib/response");
const Card = require("../models/card");

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch (err) {
    res.status(500).send({
      message: "Произошла ошибка на сервере",
      err,
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
    if (err.name === "ValidationError") {
      res.status(400).send({
        message: "Переданы некорректные данные при создании карточки",
        ...err,
      });
    }
    res.status(500).send({
      message: "Произошла ошибка в работе сервера",
      err,
    });
  }
};

const deleteCardById = async (req, res) => {
  try {
    const cardById = await Card.findByIdAndRemove(req.params.cardId);
    res.status(200).send(cardById);
  } catch (err) {
    if (err.kind === "ObjectId") {
      res.status(404).send({
        message: "Карточка с указанным id не найдена",
        err,
      });
    }
    res.status(500).send({
      message: "Произошла ошибка на сервере",
      err,
    });
  }
};

const likeCard = async (req, res) => {
  try {
    const likeCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true }
    );
    res.status(200).send(likeCard);
  } catch (err) {
    if (err.errors.name.name === "ValidationError") {
      res.status(400).send({
        message: "Переданы некорректные данные для постановки лайка",
        ...err,
      });
    } else if (err.kind === "ObjectID") {
      res.status(404).send({
        message: "Передан несуществующий id карточки",
        err,
      });
    }
    res.status(500).send({
      message: "Произошла ошибка на сервере",
      err,
    });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const dislikeCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true }
    );
    res.status(200).send(dislikeCard);
  } catch (err) {
    if (err.errors.name.name === "ValidationError") {
      res.status(400).send({
        message: "Переданы некорректные данные для снятия лайка",
        ...err,
      });
    } else if (err.kind === "ObjectID") {
      res.status(404).send({
        message: "Передан несуществующий id карточки",
        err,
      });
    }
    res.status(500).send({
      message: "Произошла ошибка на сервере",
      err,
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
