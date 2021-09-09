const express = require("express");
const path = require('path')
const jwtoken = require('jsonwebtoken');
const Details = require('./../models/model');
const bcrypt = require("bcryptjs");
const { errorMonitor } = require("events");
const { use } = require("../routes/login_signup");
const Article = require('./../models/article')
const app = express()
const mongoose = require('mongoose');
const { currentUser } = require("../middleware/login_signup_mw");
const article = require("./../models/article");


module.exports.other_profile_get = async (req, res) => {

    const user = await Details.findOne({ _id: req.params.id });
    // console.log(user)   

    const articles = await Article.find({ createdById: user.id })
    // console.log(articles)
    // res.json(articles)
    res.render('otherUserProfile', { otherUser: user, articles: articles });
}

module.exports.bookmark_get = async (req, res) => {

    // const user = await Details.findOne({ _id: req.params.id });
    // console.log(user)   

    const articles = await Article.find()
 
    res.render('bookmark' , {articles : articles});
}

module.exports.follow_put = async (req, res) => {
    
    try {
        const current = await Details.findById(res.locals.user._id);
        const to_follow = await Details.findById(req.params.id);
        // console.log(current)
        // console.log(to_follow)
        // check if already a follower
        if (current.following.includes(req.params.id)) {

            current.following.pull(req.params.id)
            to_follow.followers.pull(res.locals.user._id)

            await current.save();
            await to_follow.save();

            return res.status(200).json({ "msg": 'Unfollowed' })
        }
        else {

            current.following.push(req.params.id)
            to_follow.followers.push(res.locals.user._id)

            await current.save();
            await to_follow.save();

            return res.status(200).json({ "msg": 'Unfollowed' })
        }

    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ msg: error.message });
    }
}



module.exports.bookmark_put = async (req, res) => {
    
    console.log('request received')
    try {
        const user = await Details.findById(res.locals.user._id);

        // check if post already been liked
        if (user.bookmarks.includes(req.params.id)) {

            user.bookmarks.pull(req.params.id)
            await user.save();

            return res.status(400).json({ "msg": 'Unsaved' })
        }
        else {

            user.bookmarks.push(req.params.id);

            await user.save();
            return res.json({ "msg": 'Saved' });
        }
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ 'err': error.message });
    }
}

