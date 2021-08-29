const express = require('express');
const app = express();
const mongoose = require('mongoose')
const Article = require('./models/article')
const methodOverride = require('method-override')
const path = require('path')
const Details = require('./models/model');
const userRouter = require('./routes/login_signup')
const articleRouter = require('./routes/articles')
const port = 2000;




mongoose.connect('mongodb://localhost:27017/blogdb' ,{
    useUnifiedTopology: true, useCreateIndex: true, useNewUrlParser: true 
})

app.set('view engine' , 'ejs');
app.set('views' , path.join(__dirname ,'/templates/views'))
app.use(express.urlencoded({extended:false}))
app.use(methodOverride('_method'))

// app.get('/home' , (req,res) =>{
//     res.render('home');
// })

app.get('/',async (req,res) =>{
    const articles = await Article.find().sort({ createdAt: 'desc'})
    
    res.render('index' , {articles : articles});
})

app.get('/home' ,async (req,res) =>{
    const articles = await Article.find().sort({ createdAt: 'desc'})
    
    res.render('home' , {articles : articles});
})

app.use('/login_signup',userRouter)
app.use('/articles',articleRouter)

app.listen(port);