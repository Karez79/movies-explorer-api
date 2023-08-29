const ms = require('ms');
const User = require('../models/user');
const ApiError = require('../exceptions/api-error');
const UserService = require('../services/userAuth');

const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  UserService.registration(name, email, password).then(() => res.status(200).send({
    name,
    email,
  })).catch((e) => next(e));
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  UserService.login(email, password).then(({ user, token }) => {
    res.cookie('accessToken', token, {
      maxAge: ms('7d'),
      httpOnly: true,
    });

    return res.status(200).send({ user, token });
  }).catch((e) => next(e));
};

const logout = (req, res) => {
  res.clearCookie('accessToken');
  return res.json({ message: 'Successful logout' }).send(200);
};

const getCurrentUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      next(ApiError.NotFound('Пользователь не был найден'));
    })
    .then((user) => res.send({
      email: user.email,
      name: user.name,
    }))
    .catch((e) => {
      if (e.name === 'CastError') {
        next(ApiError.BadRequest('Некорректный id пользователя'));
        return;
      }
      next(e);
    });
};

const getUsers = (req, res, next) => {
  User.find()
    .orFail(() => {
      next(ApiError.NotFound('Пользователи не были найдены'));
    })
    .then((users) => res.send(users))
    .catch((e) => next(e));
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      next(ApiError.NotFound('Пользователь с данным id не найден'));
    })
    .then((user) => res.send(user))
    .catch((e) => {
      if (e.name === 'CastError') {
        next(ApiError.BadRequest('Некорректный id пользователя'));
        return;
      }
      next(e);
    });
};

const updateProfile = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      next(ApiError.NotFound('Пользователь с данным id не найден'));
    })
    .then((user) => res.send(user))
    .catch((e) => {
      if (e.errors) {
        next(ApiError.BadRequest(Object.values(e.errors)[0].message));
        return;
      }
      if (e.name === 'CastError') {
        next(ApiError.BadRequest('Некорректный id пользователя'));
        return;
      }
      next(e);
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  login,
  logout,
  getCurrentUserInfo,
};
