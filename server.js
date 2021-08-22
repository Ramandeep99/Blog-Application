const express = require('express');
const app = express();
const articleRouter = require('./routes/articles')
const port = 5000;

app.set('view engine' , 'ejs');

app.use('/articles' , articleRouter)

app.get('/', (req,res) =>{
    const articles = [{
        title : "Test Article",
        createdAt : Date.now(),
        description: "Test Des"
    }]
    
    res.render('index' , {article : articles});
}) 

app.listen(port);