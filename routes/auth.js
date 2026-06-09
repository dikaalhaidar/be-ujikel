const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const authController = require('../controllers/auth.controller');

router.post('/register', upload.none(), authController.register);
router.post('/login', upload.none(), authController.login);

module.exports = router;