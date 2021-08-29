const express = require("express");
const bcrypt = require("bcryptjs")
const app = express()
const router = express.Router();
const Details = require('./../models/model');
const path = require('path')
const { check, validationResult } = require('express-validator');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './../templates/views'))
// console.log(path.join(__dirname, './../templates/views'))

// console.log(__dirname)


router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user_email = await Details.findOne({ email: email });
        // console.log(user_email);    
        // res.send(user_email);        
        if (bcrypt.compare(password, user_email.password)) {
            res.redirect('./../home')
        }
        else {
            res.send('invalid password')
        }
    }
    catch (error) {
        res.status(400).send('invalid login credentials.')
    }
})

//  [check('name').isLength({ min: 3 }), check('email').isEmail(), check('contact').isNumeric()],

router.post('/register', async (req, res) => {

    // const errors = validationResult(req)
    // if (!errors.isEmpty()) {
    //     res.status(422).send({ errors: errors.array() })
    // }

    try {
        const password = req.body.password;
        const confirm_password = req.body.confirm_password;

        if (password === confirm_password) {

            // const userExist = await Detail.findOne({ email: email });
            // console.log(userExist)
            // if (userExist) {
            //     console.log(99)
            //     res.status(422).send("Email Already Exists.")
            // }

            const detail = new Details({
                name: req.body.name,
                email: req.body.email,
                contact: req.body.contact,
                password: req.body.password,
                confirm_password: req.body.confirm_password
            })

            const registered = await detail.save();
            // res.status(201).render("login");
            res.redirect('./login')
        }
        else {
            res.send('Password Not Matched!')
        }
    }
    catch (error) {
        res.status(400).send(error);
    }
})

module.exports = router