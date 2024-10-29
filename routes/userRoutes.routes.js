const express = require('express');
const router = express.Router();
const {validateCredentials, Signup, getDepartaments} = require('./controllers/users.js');

router.post('/login', validateCredentials);
router.post('/signup', Signup);
router.get('/departamentos', getDepartaments);

module.exports = router;