const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = 'verylongpasswordoftheyandexpraktikumstudent';

const SALT_ROUNDS = 10;

// const DUBLICATE_MONGOOSE_ERROR_CODE = 11000;

// eslint-disable-next-line consistent-return
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({
      message: 'Произошла ошибка на сервере',
    });
  }
};

const getUserByID = async (req, res) => {
  try {
    const userById = await User.findById(req.params.userId);
    if (!userById) {
      const error = new Error('Пользователь по заданному id отсутствует в базе');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).send(userById);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({
        message: 'Невалидный id пользователя',
      });
      return;
    }
    if (err.statusCode === 404) {
      res.status(404).send({ message: err.message });
      return;
    }
    res.status(500).send({
      message: 'Произошла ошибка на сервере',
    });
  }
};

const createUser = async (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({
      name,
      about,
      avatar,
      email,
      password: hash,
    });
    res.status(201).send(await user.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({
        message: 'Переданы некорректные данные при создании пользователя',
      });
      return;
    }
    res.status(500).send({
      message: 'Произошла ошибка в работе сервера',
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send({ message: 'Неправильные логин или пароль' });
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    res.status(401).send({ message: 'Неправильные логин или пароль' });
    return;
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    res.status(401).send({ message: 'Неправильные логин или пароль' });
    return;
  }

  const token = await jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
  res.status(200).send({ token });
};

// eslint-disable-next-line consistent-return
const userProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(200).send(user);
  } catch (err) {
    res.status(401).send({ message: 'Необходима авторизация' });
  }
};

const userUpdateProfile = async (req, res) => {
  try {
    const { name, about } = req.body;
    const updateUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    );
    res.status(200).send(updateUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({
        message: 'Переданы некорректные данные при обновлении профиля',
      });
      return;
    }
    if (err.name === 'CastError') {
      res.status(400).send({
        message: 'Переданы некорректные данные',
      });
      return;
    }
    res.status(500).send({
      message: 'Произошла ошибка в работе сервера',
    });
  }
};

const userUpdateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const updateUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    );
    res.status(200).send(updateUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({
        message: 'Переданы некорректные данные при обновлении аватара',
      });
      return;
    }
    if (err.name === 'CastError') {
      res.status(400).send({
        message: 'Переданы некорректные данные',
      });
      return;
    }
    res.status(500).send({
      message: 'Произошла ошибка в работе сервера',
    });
  }
};

module.exports = {
  getUsers,
  getUserByID,
  createUser,
  login,
  userProfile,
  userUpdateProfile,
  userUpdateAvatar,
};
