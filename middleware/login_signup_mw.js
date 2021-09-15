const jwt = require('jsonwebtoken');
const Details = require('./../models/model');

const requireAuth = (req,res,next) =>{
    const token = req.cookies.jwtoken;
    // console.log(token);
    if(token){
        jwt.verify(token , process.env.SECRETKEY , (err , decodedToken) => {
            if (err){
                // console.log(err)
                res.redirect('/login_signup/login'); 
            }
            else{

                // const userName = async (req,res) =>{
                //     const name =  await Details.findOne({_id:decodedToken._id});
                //     console.log(name.name);
                // }
                // userName();

                next();   
            }
        })
    }
    else{
        // console.log(err)
        res.redirect('/login_signup/login');
    }

}
// console.log(__dirname)



const currentUser = (req,res,next) =>{
    const token = req.cookies.jwtoken;
    // console.log(token)
    req.token = token;
    if(token){
        jwt.verify(token , process.env.SECRETKEY , async (err , decodedToken) => {
            if (err){
                // console.log(err)
                res.locals.user = null; 
                next();
            }
            else{

                // const userName = async (req,res) =>{
                //     const name =  await Details.findOne({_id:decodedToken._id});
                //     console.log(name.name);
                // }
                // userName();
                const user = await Details.findById(decodedToken._id)
                res.locals.user = user;
                
                // console.log(res.locals)
                next();
            }
        })
    }
    else{
        // console.log(err)
        res.locals.user = null; 
        next();
    }
}


const userName = (req,res,next) =>{
    const token = req.cookies.jwtoken;
    // console.log(token);
    if(token){
        jwt.verify(token , process.env.SECRETKEY ,async  (err , decodedToken) => {
            if (err){
                // console.log(err)
                res.redirect('/login_signup/login'); 
            }
            else{

                const name =  await Details.findOne({_id:decodedToken._id});
                // console.log(name.name);

                next();   
            }
        })
    }
    else{
        // console.log(err)
        res.redirect('/login_signup/login');
    }

}



module.exports = {requireAuth , currentUser , userName};