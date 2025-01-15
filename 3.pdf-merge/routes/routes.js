const express = require('express');
const router = express.Router();
const multer = require('multer');  
const MergedPdf = require('../models/mergedPdf'); 
console.log(MergedPdf); 

// Initialize multer for file handling
const upload = multer({
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'));
        }
    },
    //limits: { fileSize: 10 * 1024 * 1024 }, // Limit to 10 MB
});

// Home route
router.get('/', (req, res) => {
  res.render('index');
});


// Handle the POST request to merge PDFs
router.post('/merge-pdfs', upload.fields([
    { name: 'pdf1', maxCount: 1 }, 
    { name: 'pdf2', maxCount: 1 }
]), async (req, res) => {
    try {
        console.log('Received files:', req.files);

        // Check if both files are uploaded
        if (!req.files || !req.files['pdf1'] || !req.files['pdf2']) {
            return res.status(400).send('Both PDF files are required');
        }

        // Dynamically import PDFMerger
        const PDFMerger = (await import('pdf-merger-js')).default;
        const merger = new PDFMerger();

        // Safely access the uploaded files by their field names
        const pdf1 = req.files['pdf1'][0];
        const pdf2 = req.files['pdf2'][0];

        // Debug: Check if files are being properly received
        console.log('Uploaded PDFs:', { pdf1, pdf2 });

        // Add the PDFs to the merger
        await merger.add(pdf1.path); // Use temp file path from multer
        await merger.add(pdf2.path);

        // Define the path to save the merged PDF
        const outputFilePath = 'uploads/merged-output.pdf';
        await merger.save(outputFilePath);
        console.log('Saving merged PDF to:', outputFilePath);

        // Save the file paths to the database
        const mergedPdf = new MergedPdf({
            file1: pdf1.path,
            file2: pdf2.path,
            mergedFile: outputFilePath,
        });

        // Save the mergedPdf object to the database
        await mergedPdf.save();
        console.log('Merged PDF saved to database');

        // Send the merged file back to the client
        res.download(outputFilePath, 'merged.pdf', (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).send('Error sending file');
            }
        });
    } catch (error) {
        console.error('Error merging PDFs:', error);
        res.status(500).send('An error occurred while merging the PDFs');
    }
});


module.exports= router;  
