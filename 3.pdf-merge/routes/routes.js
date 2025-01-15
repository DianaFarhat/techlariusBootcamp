const express = require('express');
const router = express.Router();


// Home route
router.get('/', (req, res) => {
  res.render('index');
});

// Use dynamic import to avoid ESM issue
router.post('/merge-pdfs', async (req, res) => {
    const PDFMerger = (await import('pdf-merger-js')).default;
    const merger = new PDFMerger();
  
    // Your logic to merge PDFs
    try {
      // Example code to merge PDFs
      await merger.add('path/to/file1.pdf');
      await merger.add('path/to/file2.pdf');
      await merger.save('path/to/output.pdf');
      res.send('PDFs merged successfully!');
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  });
  

module.exports = router;  
