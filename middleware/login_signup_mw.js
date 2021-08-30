const jwt = require('jsonwebtoken');
const Detail = require('./../models/model');
const Details = require('./../models/model');

const requireAuth = (req,res,next) =>{
    const token = req.cookies.jwtoken;

    if(token){
        jwt.verify(token , process.env.SECRETKEY ,(err , decodedToken) => {
            if (err){
                console.log(err.message);
                res.redirect('./../templates/views/login'); 
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
        res.redirect('./../templates/views/login');
    }

}
console.log(__dirname)
module.exports = requireAuth;