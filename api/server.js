const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const sessions = require('express-session');
const KnexSessionStore = require('connect-session-knex')(sessions);

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');
const knex = require('../database/dbConfig.js');

const server = express();

const sessionConfiguration = {
  name: 'chocolatechip',
  secret: 'keep it secret, keep it safe',
  saveUninitialized: true,
  resave: false,
  store: new KnexSessionStore({
    knex,
    tablename: 'sessions',
    createTable: true,
    sidfieldname: 'sid',
    clearInterval: 1000 * 60 * 10,
  }),
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: false,
    httpOnly: true
  }
}

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(sessions(sessionConfiguration));

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.json({ api: 'up' });
});

module.exports = server;
