const multer = require('multer');
const path = require('path')

// set storage
const storage = multer.diskStorage({
    destination: function( req , file , cb){
        cb(null , './public/uploads/');
    },
    filename: function(req,file,cb){
        // to modifiy name
        const ext = file.originalname.substr(file.originalname.lastIndexOf('.'));

        cb(null , file.fieldname + '_' + Date.now() + path.extname(file.originalname) )
    }
})

store = multer({storage : storage});

module.exports = store;