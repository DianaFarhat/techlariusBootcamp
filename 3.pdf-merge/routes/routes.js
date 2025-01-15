const express = require('express');
const router = express.Router();
const PDFMerger = require('pdf-merger-js');  

// Home route
router.get('/', (req, res) => {
  res.render('index');
});

// Example of other routes
router.post('/merge-pdfs', (req, res) => {
  // Assuming files are uploaded using 'multipart/form-data'
  const pdf1 = req.files.pdf1;
  const pdf2 = req.files.pdf2;

  const merger = new PDFMerger();

  // Add both PDFs to the merger
  merger.add(pdf1.tempFilePath);
  merger.add(pdf2.tempFilePath);

  // Merge PDFs and save the result
  merger.save('merged-output.pdf')
    .then(() => {
      // Send the merged file back to the client
      res.download('merged-output.pdf', 'merged.pdf');
    })
    .catch(err => {
      res.status(500).send('Error merging PDFs');
    });
});

module.exports = router;  
