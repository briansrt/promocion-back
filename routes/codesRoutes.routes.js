const express = require('express');
const router = express.Router();
const {validateCredentials, getUserCodes} = require('./controllers/codes.js');

router.post('/registerCode', validateCredentials);
router.post('/getUserCodes', getUserCodes);


module.exports = router;