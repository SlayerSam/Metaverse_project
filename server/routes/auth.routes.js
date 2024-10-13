const express = require('express');
const { Auth } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/:path', Auth)

module.exports = router;
