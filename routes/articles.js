const express = require('express');
const Article = require('./../models/article')
const router = express.Router();
const path = require('path');
const { requireAuth, currentUser, userName } = require('./../middleware/login_signup_mw');
const app = express();
const multer = require('./../middleware/multer');
const collect = require('collect.js');


const template_path = path.join(__dirname, './templates/views');


app.set('views', template_path)


router.get('/new', (req, res) => {
    res.render('new', { article: new Article() })
})


router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render("edit", { article: article })
})


router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug })

    const comment = article.comments

    // console.log(comment)

    if (article == undefined) {
        res.redirect('/')
    }
    else {
        res.render('show', { article: article })
    }
})



router.post('/', currentUser, multer.single('file'), async (req, res, next) => {

    // console.log(res.locals.user.email)   // current user is here
    req.article = new Article()
    next()
}, PostAndPut('new'))

router.put('/:id', currentUser, multer.single('file'), async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
}, PostAndPut('edit'))


function PostAndPut(path) {
    return async (req, res) => {
        let article = req.article
        article.title = req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown

        // trying to save current user email in during post in articles collection
        article.createdBy = res.locals.user;
        article.createdById = res.locals.user.id;
        // console.log(article.createdBy)

        // image
        article.image = req.file.filename;

        try {
            article = await article.save()
            // console.log(article)
            res.redirect(`/articles/${article.slug}`)
        }
        catch (error) {
            res.render(`articles/${path}`, { article: article })
        }
    }
}

router.delete('/:id', currentUser, async (req, res) => {
    const databaseUser = await Article.findById(req.params.id);
    const UserMail = databaseUser.createdBy.email;
    // res.locals.UserMail = UserMail;
    // console.log(databaseUser)
    // console.log(res.locals.UserMail, res.locals.user.email)
    const currentMail = res.locals.user.email;
    // console.log(UserMail, currentMail);
    if (UserMail === currentMail) {
        await Article.findByIdAndDelete(req.params.id)
        res.redirect('/home')
    }
    else {
        res.send('You have not created this blog')
    }
})


// for likes
router.put("/like/:id", currentUser, async (req, res) => {

    try {
        const post = await Article.findById(req.params.id);

        // check if post already been liked
        if (post.likes.includes(res.locals.user._id)) {

            post.likes.pull(res.locals.user._id)
            await post.save();

            return res.status(400).json({ "msg": 'Disliked' })
        }
        else {

            post.likes.push(res.locals.user._id);

            await post.save();
            return res.json({ "msg": 'Liked' });
        }
    }
    catch (error) {
        // console.log(error.message);
        return res.status(500).json({ "msg": error.message });
    }
})

// for comments

router.put("/comment/:id", currentUser, async (req, res) => {
    // console.log(100)
    const comment_ = {
        text: req.body.data,
        createdBy: res.locals.user._id
    }

    try {
        const post = await Article.findById(req.params.id);
        
        post.comments.push(comment_)

        await post.save();

        return res.json({ "msg": 'commeted success' });
    }
    catch (error) {
        // console.log(error.message);
        return res.status(500).json({ "msg": error.message });
    }
})


module.exports = router