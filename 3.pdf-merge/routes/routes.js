const express = require('express')
const router = express.Router()
const mergedPdf= require('../models/mergedPdf')

// Home route
router.get('/', (req, res) => {
  res.render('index');
});


//Handling File Uploads
const multer = require('multer');
const pdfMerge = require('pdf-merge');  // Use a PDF merging library (you can choose another one)
const path = require('path');
const fs = require('fs');

// Define storage settings for multer
const upload = multer({ 
    dest: 'uploads/', // Temporary folder to store the uploaded files
    fileFilter: (req, file, cb) => {
        // Check file extension
        const extname = path.extname(file.originalname).toLowerCase();
        if (extname !== '.pdf') {
            return cb(new Error('Only PDF files are allowed.'));
        }

        // Check MIME type for PDF
        if (file.mimetype !== 'application/pdf') {
            return cb(new Error('Only PDF files are allowed.'));
        }

        // Proceed if file is a PDF
        cb(null, true);
    }
});

// Route to handle file upload and merging
router.post('/upload', upload.fields([{ name: 'file1', maxCount: 1 }, { name: 'file2', maxCount: 1 }]), (req, res) => {
    // Get the uploaded files
    const file1 = req.files.file1 ? req.files.file1[0] : null;
    const file2 = req.files.file2 ? req.files.file2[0] : null;

    // If both files are missing, return an error
    if (!file1 || !file2) {
        return res.status(400).send('Both files are required to merge.');
    }

    // Paths of the uploaded files
    const file1Path = path.join(__dirname, file1.path);
    const file2Path = path.join(__dirname, file2.path);

    // Merging the PDFs
    pdfMerge([file1Path, file2Path])
        .then((mergedPdfBuffer) => {
            // Save the merged PDF file
            const mergedFilePath = path.join(__dirname, 'uploads', 'mergedFile.pdf');
            require('fs').writeFileSync(mergedFilePath, mergedPdfBuffer);

            // Respond with the merged PDF file for download
            res.download(mergedFilePath, 'mergedFile.pdf', (err) => {
                if (err) {
                    return res.status(500).send('Error downloading the merged file.');
                }

                // Clean up temporary files after download
                require('fs').unlinkSync(file1Path);
                require('fs').unlinkSync(file2Path);
                require('fs').unlinkSync(mergedFilePath);
            });
        })
        .catch((err) => {
            console.error('Error merging PDFs:', err);
            res.status(500).send('Error merging files.');
        });
});







module.exports= router;  
