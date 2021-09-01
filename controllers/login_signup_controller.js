const express = require("express");
const path = require('path')
const jwtoken = require('jsonwebtoken');
const Details = require('./../models/model');
const bcrypt = require("bcryptjs");
const { errorMonitor } = require("events");
const { use } = require("../routes/login_signup");
const app = express()

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './../templates/views'))

// handle error
const handleErrors = (err) => {
    // console.log(err.message , err.code);

    let errors = { email: "", password: "" };

    // duplicate error code
    if (err.code === 11000) {
        errors.email = "Email already registered"
        return errors;
    }

    // validation error
    if (err.message.includes('Detail validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        })
    }

    return errors;

}

module.exports.register_get = (req, res) => {
    res.render('register');
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

module.exports.register_post = async (req, res) => {

    try {
        const password = req.body.password;
        const confirm_password = req.body.confirm_password;
        if (password === confirm_password) {

            const detail = new Details({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            })

            // console.log(detail)
            const registered = await detail.save();

            // generating jwt at login
            const token = await registered.generateAuthToken();
            // console.log(token);

            // storing cookies
            var maxTime = 10 * 60 * 60
            res.cookie("jwtoken", token, {
                httpOnly: true,
                // expiresIn: maxTime*1000
                expires : new Date(Date.now() + maxTime)
            })

            // console.log('99')
            res.status(201).json({registered : registered._id})
        }
        else {
            res.json({'error' : 'Enter same confirm password'})
        }
    }
    catch (error) {
        const errors = handleErrors(error);
        res.send({ errors });
    }
}


module.exports.login_post = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await Details.findOne({ email: email });

        if (userData) {
            const isMatch = await bcrypt.compare(password, userData.password);

            // generating jwt at login 
            const token = await userData.generateAuthToken();

            // storing cookies
            // var maxTime = 10 * 60 * 60
            res.cookie("jwtoken" , token , {
                expires: new Date(Date.now() + 3600000),
                // expiresIn: maxTime*1000,
                httpOnly: true
            })

            if (isMatch) {
                res.status(200).json({userData : userData._id});
            }
            else {
                res.json({"password" : "invalid password"});
            }
        }
        else {
            res.json({'email' :'InValid Email'})
        }
    }
    catch (error) {
        handleErrors(error);
        res.status(400).json({error})
    }
}


module.exports.logout_get = (req,res) =>{
    res.cookie('jwtoken' , "" ,{
        expires: new Date(Date.now() + 1)
    });
    res.redirect('/login_signup/login')
}


