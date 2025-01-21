const express = require('express')
const router = express.Router()
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfMerge = require('easy-pdf-merge');

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


/*
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
*/

router.post('/mergepdfs', mergepdffilesupload.array('files', 100), (req, res) => {
    // Ensure files are provided
    if (!req.files || req.files.length === 0) {
        return res.status(400).send("No PDF files uploaded.");
    }

    const fileList = req.files.map(file => file.path); // Extract file paths
    const outputFilePath = path.join("uploads", `${Date.now()}-merged.pdf`); // Save merged file in 'uploads'

    // Merge PDFs
    pdfMerge(fileList, outputFilePath, function (err) {
        if (err) {
            console.error("Error merging PDFs:", err);
            return res.status(500).send("Failed to merge PDF files.");
        }

        // Send the merged file to the user
        res.download(outputFilePath, err => {
            // Handle download errors
            if (err) {
                console.error("Error sending merged PDF:", err);
                return res.status(500).send("Failed to send merged PDF file.");
            }

            // Clean up: delete the merged file
            fs.unlink(outputFilePath, err => {
                if (err) console.error("Error deleting merged PDF:", err);
            });
        });
    });
});


module.exports = router; 
