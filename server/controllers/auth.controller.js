const { avatars } = require('../database/db');
const { signup, login } = require('../utils/auth.utils');

async function login({ email, password }) {
  const result = login(email, password)

  if (result == 'not found') {
    throw new Error('Could not find user')
  }
  if (result == 'wrong password') {
    throw new Error('Incorrect password')
  }
  else {
    result.lastLoginAt = new Date.now()
    delete result.password;
    result.avatar = avatars[result.avatar]
    return result
  }
}

async function Signup({ name, email, password }) {
  const result = signup(name, email, password)

  if (result == 'server error') {
    throw new Error('Server error')
  }

  return result
}

module.exports = { Signup, login };
