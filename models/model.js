const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const validator = require('validator');

const detailSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true , "Please enter your name"]
    },   
    email:{
        type:String,
        required: [true , "Please enter an email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail , 'Please enter a valid email']
    },
    password:{
        type:String,
        required: [true , "Please enter a password"],
        minlength :[4,"Minimum password length is 4 characters"]
    }    
})

detailSchema.pre("save" , async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

// generating token
const maxTime = 10*60*60
detailSchema.methods.generateAuthToken = async function(){
    try{
        let token = jwt.sign({_id : this._id} , process.env.SECRETKEY , {
            expiresIn : maxTime
        });
        // this.tokens = this.tokens.concat({token: token}); 
        // await this.save();
        return token;
    }
    catch(error){
        console.log(error)
    }
}




const Detail = new mongoose.model('Detail' , detailSchema)

module.exports = Detail;