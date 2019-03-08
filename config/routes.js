const axios = require('axios');
const bcrypt = require('bcryptjs');
const Users = require('../model/usersModel');
const jwt = require('jsonwebtoken')

const { authenticate } = require('../auth/authenticate');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
  // implement user registration
  let user= req.body;
  const hash= bcrypt.hashSync(user.password, 12)
  user.password= hash;

  Users.add(user)
  .then(saved => {
    res.status(201).json(saved);
  })
  .catch(err => {
    res.status(500).json(err)
  })
}

function login(req, res) {
  // implement user login
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
