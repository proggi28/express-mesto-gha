const express = require('express');
const usersRoutes = require('express').Router();

const {
  getUsers,
  getUserByID,
  userProfile,
  userUpdateProfile,
  userUpdateAvatar,
} = require('../controllers/users');

usersRoutes.get('/', getUsers);

usersRoutes.get('/:userId', getUserByID);

usersRoutes.get('/me', express.json(), userProfile);

usersRoutes.patch('/me', express.json(), userUpdateProfile);

usersRoutes.patch('/me/avatar', express.json(), userUpdateAvatar);

module.exports = {
  usersRoutes,
};
