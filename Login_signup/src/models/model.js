const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const detailSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },   
    email:{
        type:String,
        required:true
    },
    contact:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    confirm_password: {
        type:String,
        required:true
    }
    
})

detailSchema.pre("save" , async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);

        this.confirm_password = undefined;
    }
    next();
})


const Detail = new mongoose.model('Detail' , detailSchema)

module.exports = Detail;