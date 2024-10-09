const mongoose = require('mongoose');

     const keywordSchema = new mongoose.Schema({
         keyword: { type: String, required: true },
         urls: [{ type: String }]
     });

     module.exports = mongoose.model('Keyword', keywordSchema);