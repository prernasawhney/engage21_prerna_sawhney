const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {ClassworkCreate,GetClass,GetClassWork,UpdateClassWork,DeleteClassWork,SubmitAnswer,GetAnswer} = require('../../controller/classwork.js');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: "./public/assignments",
    filename: function(req, file, cb){
       cb(null,"assignment_" + Date.now() + path.extname(file.originalname));
    }
});
const upload =  multer({
    storage: storage,
    limits: {fileSize: 10000000},
})
const path = require('path');
router.post('/create', upload.single('attachment'), ClassworkCreate)
router.get('/class/get/:class', jsonParser,GetClass);
router.get('/get/:classwork', jsonParser,GetClassWork);
router.post('/update/:id',upload.single('attachment'), UpdateClassWork);
router.post('/delete/:id', jsonParser, DeleteClassWork)
router.post('/submit/answer', upload.single('answer'), SubmitAnswer);
router.get('/get/answer/:classwork', jsonParser,GetAnswer);
module.exports = router;