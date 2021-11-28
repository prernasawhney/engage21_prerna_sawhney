const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {GetClass,
    GetUser,
    GetTaught,
    GetStudied,
    CreateClass,
    AddTeacher,
    DeleteTeacher,
    Archive,
    UnArchive,
    StudentRegister,
    StudentAdd,
    StudentDelete,
    StudentRemove,
    Update,
    UserArchive,
    UserUnarchive} =require('../../controller/class')

router.get('/get/class/:classId',GetClass)

router.get("/get/created/:user", GetUser)

router.get('/get/taught/:user',GetTaught)

router.get('/get/studied/:user', GetStudied)

router.post("/create",CreateClass);

router.post('/teacher/add', jsonParser, AddTeacher)

router.post("/teacher/delete", jsonParser,DeleteTeacher)

//owner archive class
router.post('/archive', jsonParser,Archive)
//owner unarchive class
router.post('/unarchive', jsonParser,UnArchive)

router.post('/students/register', jsonParser,StudentRegister)

router.post('/students/add', jsonParser,StudentAdd)

router.post("/students/delete", jsonParser,StudentDelete)

router.post("/students/remove", jsonParser, StudentRemove)

router.post('/update', jsonParser,Update);

//user archive class
router.post('/user/archive', jsonParser,UserArchive)
//user unarchive class
router.post('/user/unarchive', jsonParser,UserUnarchive)

module.exports = router;
