const express = require('express');
const usersRoutes = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getUsers,
  getUserByID,
  userProfile,
  userUpdateProfile,
  userUpdateAvatar,
} = require('../controllers/users');

usersRoutes.get('/', getUsers);

usersRoutes.get('/me', express.json(), userProfile);

usersRoutes.get('/:userId', auth, getUserByID);

usersRoutes.patch('/me', auth, express.json(), userUpdateProfile);

usersRoutes.patch('/me/avatar', auth, express.json(), userUpdateAvatar);

module.exports = {
  usersRoutes,
};
