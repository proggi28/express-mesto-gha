const User = require("../models/user");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({
      message: "Произошла ошибка на сервере",
      err,
    });
  }
};

const getUserByID = async (req, res) => {
  try {
    const userById = await User.findById(req.params.userId);
    res.status(200).send(userById);
  } catch (err) {
    if (err.kind === "ObjectID") {
      res.status(400).send({
        message: "Пользователь по указанному id не найден",
        err,
      });
    }
    res.status(500).send({
      message: "Произошла ошибка на сервере",
      err,
    });
  }
};

const createUser = async (req, res) => {
  const { name, about, avatar } = req.body;
  try {
    const user = new User({ name, about, avatar });
    res.status(201).send(await user.save());
  } catch (err) {
    if (err.errors.name.name === "ValidationError") {
      res.status(400).send({
        message: "Переданы некорректные данные при создании пользователя",
        ...err,
      });
    }
    res.status(500).send({
      message: "Произошла ошибка в работе сервера",
      err,
    });
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
        upsert: true,
      }
    );
    res.status(200).send(updateUser);
  } catch (err) {
    if (err.errors.name.name === "ValidationError") {
      res.status(400).send({
        message: "Переданы некорректные данные при обновлении профиля",
        ...err,
      });
    } else if (err.kind === "ObjectID") {
      res.status(404).send({
        message: "Пользователь с указанным id не найден",
        err,
      });
    }
    res.status(500).send({
      message: "Произошла ошибка в работе сервера",
      err,
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
        upsert: true,
      }
    );
    res.status(200).send(updateUser);
  } catch (err) {
    if (err.errors.name.name === "ValidationError") {
      res.status(400).send({
        message: "Переданы некорректные данные при обновлении аватара",
        ...err,
      });
    } else if (err.kind === "ObjectID") {
      res.status(404).send({
        message: "Пользователь с указанным id не найден",
        err,
      });
    }
    res.status(500).send({
      message: "Произошла ошибка в работе сервера",
      err,
    });
  }
};

module.exports = {
  getUsers,
  getUserByID,
  createUser,
  userUpdateProfile,
  userUpdateAvatar,
};
