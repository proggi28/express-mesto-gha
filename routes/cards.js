const express = require('express');
const cardsRoutes = require('express').Router();
const auth = require('../middlewares/auth');

const {
  createCard,
  getCards,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardsRoutes.get('/', auth, getCards);

cardsRoutes.post('/', auth, express.json(), createCard);

cardsRoutes.delete('/:cardId', auth, deleteCardById);

cardsRoutes.put('/:cardId/likes', auth, express.json(), likeCard);

cardsRoutes.delete('/:cardId/likes', auth, dislikeCard);

module.exports = {
  cardsRoutes,
};
