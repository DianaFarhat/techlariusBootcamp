const mongoose= require('mongoose');
const { merge } = require('../routes/routes');

const mergedPdfSchema= new mongoose.Schema({
    file1: {
        type: String,  
        required: true
    },
    file2: {
        type: String,  
        required: true
    },
    mergedFile: {
        type: String,  
        default: null
    }
})