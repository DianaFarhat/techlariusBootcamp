const express = require('express')
const router = express.Router()
const mergedPdf= require('../models/mergedPdf')
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfMerge = require('pdf-merge');

// Home route
router.get('/', (req, res) => {
  res.render('index');
});



// Ensure 'uploads' folder exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

var storage= multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "uploads");
    },
    filename: function (req, file, cb){
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
})

const mergepdffilter= function(req, file, callback){
    var ext= path.extname(file.originalname);
    if(ext != ".pdf"){
        return callback("This extension is not supported");
    }
    callback(null, true);
}

var mergepdffilesupload= multer({storage: storage, fileFilter: mergepdffilter})



router.post('/mergepdfs', mergepdffilesupload.array('files', 100), (req, res) => {
    const fileList=[];
    outputFilePath= Date.now()+ "merged.pdf"
    if(req.files){
        req.files.forEach(file=> {
            console.log(file.path)
            fileList.push(file.path)
        })
        console.log(fileList)
        pdfMerge(fileList, outputFilePath, function(err) {
            if(err){
                res.send(err)
            }
            res.download(outputFilePath, (err)=> {
                if(err){
                    res.send(err)
                }
                fs.unlinkSync(outputFilePath)
            })
            
        })
    }
});



module.exports= router;  
