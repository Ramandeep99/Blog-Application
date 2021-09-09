const express = require("express");
const authcontrollers = require('../controllers/login_signup_controller');
const other_user_profile_controllers = require('../controllers/user_controllers');
const { requireAuth, currentUser, userName } = require('./../middleware/login_signup_mw');
const router = express.Router();

router.get('/register', authcontrollers.register_get);

router.get('/login', authcontrollers.login_get);

router.post('/login', authcontrollers.login_post);

router.post('/register', authcontrollers.register_post);

router.get('/logout',currentUser, authcontrollers.logout_get);

router.get('/profile',currentUser, authcontrollers.profile_get);

router.get('/other_profile/:id' ,currentUser, other_user_profile_controllers.other_profile_get);

router.put('/follow/:id' , currentUser, other_user_profile_controllers.follow_put);

router.get('/bookmark' , currentUser, other_user_profile_controllers.bookmark_get);

router.put('/bookmark/:id' , currentUser, other_user_profile_controllers.bookmark_put);

module.exports = router