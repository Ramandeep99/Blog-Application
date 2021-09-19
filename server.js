const express = require('express');
const app = express();
const mongoose = require('mongoose')
const Article = require('./models/article')
const methodOverride = require('method-override')
const path = require('path')
const Details = require('./models/model');
const userRouter = require('./routes/login_signup')
const articleRouter = require('./routes/articles')
const otherUser = require('./routes/user')
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const { json } = require('express');
const {requireAuth , currentUser} = require('./middleware/login_signup_mw');
const logger = require('morgan')
const port = process.env.PORT || 80;
const moment = require("moment");



// console.log(__dirname)
dotenv.config({path : './config.env'});

// connection to database
// mongoose.connect('mongodb://localhost:27017/blogdb' ,{
//     useUnifiedTopology: true, useCreateIndex: true, useNewUrlParser: true 
// })

// connect to Atlas
const dbURI = process.env.DATABASE.replace("<PASSWORD>" ,process.env.PASSWORD );
mongoose.connect(dbURI ,{
    useUnifiedTopology: true, useCreateIndex: true, useNewUrlParser: true 
}).then( (res) => app.listen(port ,() =>{console.log(`App running from ${port} port`)}))
  .catch((err) => console.log(err));


// middlewalres
app.use(express.urlencoded({extended:false}))
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(cookieParser())
// app.use(logger('combined'));
app.use(express.json())
app.use((req, res, next)=>{
    res.locals.moment = moment;
    next();
  });


// view engines
app.set('view engine' , 'ejs');
app.set('views' , path.join(__dirname ,'/templates/views'))


// routes
app.get('*' , currentUser)  // to apply this middleware to all the routes
app.get('/',async (req,res) =>{
    const articles = await Article.find().sort({ createdAt: 'desc'})
    res.render('login' , {articles : articles}); 
})


app.get('/' , requireAuth ,  async (req,res) =>{
    const articles = await Article.find().sort({ createdAt: 'desc'})
    res.render('home' , {articles : articles});
})

app.get('/home' , requireAuth ,  async (req,res) =>{
    const articles = await Article.find().sort({ createdAt: 'desc'})
    res.render('home' , {articles : articles});
})

app.use('/login_signup',userRouter)
app.use('/articles',articleRouter)
// app.use('/user',otherUser)

