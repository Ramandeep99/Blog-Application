const express = require('express');
const Article = require('./../models/article')
const router = express.Router();
const path = require('path');
const app = express();


const template_path = path.join(__dirname,'./templates/views');


app.set('views' , template_path)


router.get('/new', (req, res) => {
    res.render('new', { article : new Article() })
})


router.get('/edit/:id', async (req, res) => {   
    const article = await Article.findById(req.params.id)
    res.render("edit", { article: article })
})


router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug })
    if (article == undefined) {
        res.redirect('/')
    }
    else {
        res.render('show', { article: article })
    }
})


router.post('/', async (req, res, next) => {

    req.article =  new Article()
    next()  
}, PostAndPut('new'))

router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
}, PostAndPut('edit'))


function PostAndPut(path) {
    return async (req, res) => {
        let article = req.article
        article.title = req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown

        try {
            article = await article.save()
            res.redirect(`/articles/${article.slug}`)
        }
        catch (error) {
            res.render(`articles/${path}`, { article: article })
        }
    }
}

router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/home')
})


module.exports = router