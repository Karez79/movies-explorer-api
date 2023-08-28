require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const rateLimit = require('./services/limiter');

const usersRouter = require('./routes/user');
const moviesRouter = require('./routes/movie');
const userController = require('./controllers/user');
const ApiError = require('./exceptions/api-error');
const errorMiddleware = require('./middlewares/error');
const authMiddleware = require('./middlewares/auth');
const { reqLogger, errLogger } = require('./middlewares/logger');

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: ['https://ivan.nomoredomainsicu.ru', 'http://ivan.nomoredomainsicu.ru'],
}));

app.use(reqLogger);
app.use(rateLimit);
app.use('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), userController.login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), userController.createUser);
app.post('/logout', userController.logout);

app.use('/users', authMiddleware, usersRouter);
app.use('/movies', authMiddleware, moviesRouter);
app.all('*', (req, res, next) => {
  next(ApiError.NotFound('Неверный URL'));
});
app.use(errLogger);
app.use(errors());
app.use(errorMiddleware);

const { PORT = 4000, DB_URL = 'mongodb://0.0.0.0:27017/bitfilmsdb' } = process.env;
mongoose.connect(DB_URL);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
