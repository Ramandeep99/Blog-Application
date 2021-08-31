const express = require('express');
const app = express();
const mongoose = require('mongoose')
const Article = require('./models/article')
const methodOverride = require('method-override')
const path = require('path')
const Details = require('./models/model');
const userRouter = require('./routes/login_signup')
const articleRouter = require('./routes/articles')
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const { json } = require('express');
const {requireAuth , currentUser} = require('./middleware/login_signup_mw');
const port = 2000;

// console.log(__dirname)
dotenv.config({path : './config.env'});

// connection to database
mongoose.connect('mongodb://localhost:27017/blogdb' ,{
    useUnifiedTopology: true, useCreateIndex: true, useNewUrlParser: true 
})

// middlewalres
app.use(express.urlencoded({extended:false}))
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(cookieParser())
app.use(json())


// view engines
app.set('view engine' , 'ejs');
app.set('views' , path.join(__dirname ,'/templates/views'))


// routes
app.get('*' , currentUser)  // to apply this middleware to all the routes
app.get('/',async (req,res) =>{
    const articles = await Article.find().sort({ createdAt: 'desc'})
    res.render('index' , {articles : articles}); 
})

app.get('/home' , requireAuth ,  async (req,res) =>{
    const articles = await Article.find().sort({ createdAt: 'desc'})
    res.render('home' , {articles : articles});
})

app.use('/login_signup',userRouter)
app.use('/articles',articleRouter)

app.listen(port);