const multer = require('multer');
const path = require('path')

// set storage
const storage = multer.diskStorage({
    destination: function( req , file , cb){
        cb(null , './public/uploads/');
    },
    filename: function(req,file,cb){
        // to modifiy name
        // filename.split('.').slice(0, -1).join('.')
        const ext = file.originalname.substr(file.originalname.lastIndexOf('.'));

        cb(null , file.originalname.split('.').slice(0, -1) + '_' + Date.now() + ext)
    }
})

store = multer({storage : storage});

module.exports = store;