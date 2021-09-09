const express = require("express");
const other_user_profile_controllers = require('../controllers/user_controllers');
const router = express.Router();


router.get('/other_profile/:id' , other_user_profile_controllers.other_profile_get);


module.exports = router