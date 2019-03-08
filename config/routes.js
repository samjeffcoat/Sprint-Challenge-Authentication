const axios = require('axios');
const { authenticate } = require('../auth/authenticate');
const Users = require('../models/user-model');


const jwt= require('jsonwebtoken');
const bcrypt = require('bcryptjs');




module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};
const secret= process.env.JWT_SECRET|| 'Thus is a test';
//had wriong syntax

function register(req, res) {
  // implement user registration
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10)
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(err => {
      res.status(500).json(err)
    })
}
function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: '1d'
  }
  return jwt.sign(payload, secret, options);
}


function login(req, res) {
  // implement user login
  let {username, password} = req.body;
  Users.findBy({username})
  .first()
  .then(user => {
    console.log(user.password)
    if(user && bcrypt.compareSync(password, user.password)){
      const token = generateToken(user);
      res.status(200).json({
        message: `Welcome ${user.username}!, have a token!`,
        token,
      });
    } else{
      res.status(401).json({message: 'Invalid Credentials'}
      );
    }
  })
    .catch(error => {
      res.status(500).json(error);
    })
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
