const express = require("express");
const authcontrollers = require('../controllers/login_signup_controller');
const router = express.Router();

router.get('/register', authcontrollers.register_get);

router.get('/login', authcontrollers.login_get);

router.post('/login', authcontrollers.login_post);

router.post('/register', authcontrollers.register_post);

router.get('/logout', authcontrollers.logout_get);


module.exports = router