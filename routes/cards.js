const express = require("express");
const cardsRoutes = require("express").Router();

const { createCard, getCards, deleteCardById, likeCard, dislikeCard } = require("../controllers/cards");

cardsRoutes.get("/", getCards);

cardsRoutes.post("/", express.json(), createCard);

cardsRoutes.delete("/:cardId", deleteCardById);

cardsRoutes.put("/:cardId/likes", express.json(), likeCard);

cardsRoutes.delete("/:cardId/likes", dislikeCard);

module.exports = {
  cardsRoutes
}