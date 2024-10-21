const express = require('express');
const router = express.Router();
const {validateCredentials} = require('./controllers/codes.js');

router.post('/registerCode', validateCredentials);


module.exports = router;