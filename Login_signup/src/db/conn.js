const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/blogdb' ,{
    useUnifiedTopology: true,useCreateIndex: true, useNewUrlParser: true
}).then(() =>{
    console.log('connected');
}).catch((e) =>{
    console.log(e);
})