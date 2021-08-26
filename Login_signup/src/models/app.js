const express = require("express");
// const { use } = require("marked");
const bcrypt = require("bcryptjs")
const app = express()
const port = 4000;
const path = require('path')


require(path.join(__dirname ,'../db/conn'))
const Details = require('./model')

// console.log(path.join(__dirname ,'../../templates/views'))

app.set('view engine' , 'ejs');
app.set('views' , path.join(__dirname ,'../../templates/views'))

app.use(express.urlencoded({extended:false}))

app.get('/' , (req,res) =>{
    res.render('index');
})

app.get('/index' , (req,res) =>{
    res.render('index');
})

app.get('/register' , (req,res) =>{
    res.render('register');
})

app.get('/login' , (req,res)=>{
    res.render('login');
})

app.post('/login' ,async (req,res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;

        const user_email = await Details.findOne({email:email});
        // console.log(user_email);    
        // res.send(user_email);        
        if(bcrypt.compare(password , user_email.password)){
            res.redirect('index')
        }
        else{
            res.send('invalid password')
        }
    }
    catch(error){
        res.status(400).send('invalid login credentials.')
    }
})

app.post('/register' , async (req,res) =>{

    try{
        const password = req.body.password;
        const confirm_password = req.body.confirm_password;
        if(password === confirm_password){
            const detail = new Details({
                name : req.body.name,
                email : req.body.email,
                contact : req.body.contact,
                password : req.body.password,
                confirm_password: req.body.confirm_password
            })

            const registered = await detail.save();
            res.status(201).redirect("index");
        }
        else{
            res.send('Password Not Matched!')
        }
    }
    catch(error){
        res.status(400).send(error);
    }
})

app.listen(port, (req,res) =>{
    console.log('Listining from ')
});