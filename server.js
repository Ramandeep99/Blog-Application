const express = require('express');
const app = express();
const mongoose = require('mongoose')
const articleRouter = require('./routes/articles')
const Article = require('./models/article')
const port = 2000;

mongoose.connect('mongodb://localhost/blogdb' ,{
    useUnifiedTopology: true, useNewUrlParser: true
})

app.set('view engine' , 'ejs');
app.use(express.urlencoded({extended:false}))

app.get('/',async (req,res) =>{
    const articles = await Article.find().sort({ createdAt: 'desc'})
    
    res.render('articles/index' , {articles : articles});
}) 

app.use('/articles' , articleRouter)
app.listen(port);