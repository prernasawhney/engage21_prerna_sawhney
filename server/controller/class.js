const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const User = require('../models/user');
const Class = require('../models/class');
const {nanoid} = require('nanoid');

async function GetClass(req, res) {
    const classId = req.params.classId;
    Class.findById(classId)
    .then(_class => res.json(_class))
    .catch(() => res.status(400).json("Something went wrong"))
}
async function GetUser (req,res) {
    const user = req.params.user;
    Class.find({owner: user})
    .then(classes => res.json(classes))
    .catch(() => res.status(400).json("Something went wrong"))
}

async function GetTaught (req, res){
    const user = req.params.user;
    Class.find({teacher: {"$in": [user]}})
    .then(classes => res.json(classes))
    .catch(() => res.status(400).json("Something went wrong"))
}

async function GetStudied (req, res)  {
    const user = req.params.user;
    Class.find({students: {"$in": [user]}})
    .then(classes => res.json(classes))
    .catch(() => res.status(400).json("Something went wrong"))
}

async function CreateClass(req, res) {
    const {title, description, owner, token} = req.body;
    
    User.findOne({_id: owner, token: token}, (err, user) => {
        if(err) res.status(500).json("Something went wrong.")
        else if (!user) res.status(400).json("User not found")
        else{
            const _class = new Class({title, description, owner, code: nanoid(11)})
            _class.save()
            .then(() => res.json({message: "Success", classId: _class._id}))
            .catch(err => res.status(400).json("Something went wrong."))
        }
    })
}
async function AddTeacher(req, res) {
    const {teacher, token, _class, owner} = req.body;
    User.findOne({_id: teacher}, (err, user) =>{
        if(err) res.status(500).json("Something went wrong.")
        else if (!user) res.status(400).json("User not found")
        else{
            User.findOne({_id: owner, token}, (err, user) => {
                if(err) res.status(500).json("Something went wrong.")
                else if (!user) res.status(403).json("Permission denied.")
                else{
                    Class.findOne({_id: _class}, (err, __class) => {
                        if(err) res.status(500).json("Something went wrong")
                        else if(!__class) res.status(400).json("Class not found.")
                        else{
                            if(String(__class.owner) === teacher) res.status(400).json("The user already has a role in this class.")
                            else{
                                if(__class.students.includes(teacher)){
                                    for(let i = 0; i< __class.students.length; i++){
                                        if(__class.students[i] === teacher){__class.students.splice(i, 1); i-- }
                                    }
                                }
                                __class.teacher.push(teacher)
                                __class.save()
                                .then(() => res.json("Success"))
                                .catch(err => res.status(400).json("Something went wrong."))
                            }
                        }
                    })
                }
            })
        }
    })
}

async function DeleteTeacher  (req, res) {
    const {token, teacher, _class, owner} = req.body;
    User.findOne({_id: owner, token: token}, (err, user) => {
        if(err) res.status(500).json("Something went wrong.")
        else if(!user) res.status(403).json("Permission denied.")
        else{
            Class.findOne({_id: _class}, (err, __class) => {
                if(err) res.status(500).json("Something went wrong")
                else if(!__class) res.status(400).json("Class not found.")
                else{
                    if(__class.teacher.includes(teacher)){
                        for(let i = 0; i< __class.teacher.length; i++){
                            if(__class.teacher[i] === teacher){__class.teacher.splice(i, 1); i-- }
                        }
                    }
                    __class.save()
                    .then(() => res.json("Success"))
                    .catch(err => res.status(400).json("Something went wrong."))
                }
            })
        }
    })
}
//owner archive class
async function Archive (req, res) {
    const {token, _class, owner} = req.body;
    User.findOne({_id: owner, token}, (err, user) => {
        if(err) res.status(500).json("Something went wrong.")
        else if(!user) res.status(403).json("Permission denied.")
        else{
            Class.findOne({_id: _class}, (err, __class) => {
                if(err) res.status(500).json("Something went wrong")
                else if(!__class) res.status(400).json("Class not found.")
                else{
                    __class.archived = true
                    __class.save()
                    .then(() => res.json("Success"))
                    .catch(err => res.status(400).json("Something went wrong."))
                }
            })
        }
    })
}

//owner unarchive class
async function UnArchive (req, res) {
    const {token, _class, owner} = req.body
    User.findOne({_id: owner, token}, (err, user) => {
        if(err) res.status(500).json("Something went wrong.")
        else if(!user) res.status(403).json("Permission denied.")
        else{
            Class.findOne({_id: _class}, (err, __class) => {
                if(err) res.status(500).json("Something went wrong")
                else if(!__class) res.status(400).json("Class not found.")
                else{
                    __class.archived = false
                    __class.save()
                    .then(() => res.json("Success"))
                    .catch(err => res.status(400).json("Something went wrong."))
                }
            })
        }
    })
}

async  function StudentRegister (req, res) {
    const {token, _class, student} = req.body;
    User.findOne({_id: student, token}, (err, user) => {
        if(err) res.status(500).json("Something went wrong.")
        else if(!user) res.status(403).json("Permission denied.")
        else{
            Class.findOne({code: _class}, (err, __class) => {
                if(err) res.status(500).json("Something went wrong")
                else if(!__class) res.status(400).json("Class not found.")
                else{
                    if(String(__class.owner) === student || __class.teacher.includes(student)) res.status(400).json("The user already has a role in this class.")
                    __class.students.push(student)
                    __class.save()
                    .then(() => res.json({message:"Success", classId: __class._id}))
                    .catch(() => res.status(400).json("Something went wrong."))
                }
            })
        }
    })
}

async function StudentAdd(req, res) {
    const {token, _class, student, owner} = req.body;
    User.findOne({_id: student}, (err, user) => {
        if(err) res.status(500).json("Something went wrong.")
        else if(!user) res.status(403).json("Permission denied.")
        else{
            User.findOne({_id: owner, token}, (err,user) => {
                if(err) res.status(500).json("Something went wrong.")
                else if(!user) res.status(403).json("Permission denied.")
                else{
                    Class.findOne({code: _class}, (err, __class) => {
                        if(err) res.status(500).json("Something went wrong")
                        else if(!__class) res.status(400).json("Class not found.")
                        else{
                            if(String(__class.owner) === student) res.status(400).json("The user already has a role in this class.")
                            else{
                                if(__class.teacher.includes(student)){
                                    for(let i = 0; i< __class.teacher.length; i++){
                                        if(__class.teacher[i] === student) {__class.teacher.splice(i, 1); i-- }
                                    }
                                }
                                __class.students.push(student)
                                __class.save()
                                .then(() => res.json({message:"Success", classId: __class._id}))
                                .catch(() => res.status(400).json("Something went wrong."))
                            }
                        }
                    })
                }
            })
        }
    })
}
async function StudentDelete (req, res) {
    const {token, _class, student} = req.body;
    User.findOne({_id: student, token}, (err, user) => {
        if(err) res.status(500).json("Something went wrong.")
        else if(!user) res.status(403).json("Permission denied.")
        else{
            Class.findOne({_id: _class}, (err, __class) => {
                if(err) res.status(500).json("Something went wrong")
                else if(!__class) res.status(400).json("Class not found.")
                else{
                    if(__class.students.includes(student)){
                        for(let i = 0; i< __class.students.length; i++){
                            if(__class.students[i] === student) {__class.students.splice(i, 1); i-- }
                        }
                    }
                    __class.save()
                    .then(() => res.json("Success"))
                    .catch(err => res.status(400).json("Something went wrong."))
                }
            })
        }
    })
}

async function StudentRemove  (req, res) {
    const {token, owner, student, _class} = req.body;
    User.findOne({_id: owner, token}, (err, user) => {
        if(err) res.status(500).json("Something went wrong.")
        else if(!user) res.status(403).json("Permission denied.")
        else{
            Class.findOne({_id: _class}, (err, __class) => {
                if(err) res.status(500).json("Something went wrong")
                else if(!__class) res.status(400).json("Class not found.")
                else{
                    if(__class.students.includes(student)){
                        for(let i = 0; i< __class.students.length; i++){
                            if(__class.students[i] === student) {__class.students.splice(i, 1); i-- }
                        }
                    }
                    __class.save()
                    .then(() => res.json("Success"))
                    .catch(err => res.status(400).json("Something went wrong."))
                }
            })
        }
    })

}

async function Update (req, res)  {
    const {token, _class, owner, title, description} = req.body;
    User.findOne({_id: owner, token}, (err, user) => {
        if(err) res.status(500).json("Something went wrong.")
        else if(!user) res.status(403).json("Permission denied.")
        else{
            Class.findOne({_id: _class}, (err, __class) => {
                if(err) res.status(500).json("Something went wrong")
                else if(!__class) res.status(400).json("Class not found.")
                else{
                    __class.title = title
                    __class.description = description
                    __class.save()
                    .then(() => res.json("Success."))
                    .catch(() => res.status(400).json("Something went wrong."))
                }
            })
        } 
    })
}

//user archive class
async function UserArchive (req, res)  {
    const {token, student, _class} = req.body;
    Class.findOne({students: {"$in": [student]}, _id: _class}, (err, __class) => {
        if(err) res.status(500).json("Something went wrong.")
        else if(!__class){
            Class.findOne({teacher: {"$in": [student]}, _id: _class}, (err, __class) => {
                if(err) res.status(500).json("Something went wrong.")
                else if(!__class) res.status(400).json("Class not found")
                else{
                    User.findOne({_id: student, token}, (err, user) => {
                        if(err) res.status(500).json("Something went wrong.")
                        else if(!user) res.status(400).json("User not found")
                        else{
                            user.archived_class.push(__class._id)
                            user.save()
                            .then(() => res.json("Success"))
                            .catch(() => res.status(400).json("Something went wrong."))
                        }
                    })
                }
            })
        }
        else{
            User.findOne({_id: student, token}, (err, user) => {
                if(err) res.status(500).json("Something went wrong.")
                else if(!user) res.status(400).json("User not found")
                else{
                    user.archived_class.push(__class._id)
                    user.save()
                    .then(() => res.json("Success"))
                    .catch(() => res.status(400).json("Something went wrong."))
                }
            })
        }
    })
    .catch(() => res.status(400).json("Something went wrong."))
}
//user unarchive class
async function UserUnarchive(req, res)  {
    const {token, student, _class} = req.body;
    Class.findOne({students: {"$in": [student]}, _id: _class}, (err, __class) => {
        if(err) res.status(500).json("Something went wrong.")
        else if(!__class) {
            Class.findOne({teacher: {"$in": [student]}, _id: _class}, (err, __class) => {
                if(err) res.status(500).json("Something went wrong.")
                else if(!__class) res.status(400).json("Class not found")
                else{
                    User.findOne({_id: student, token}, (err, user) => {
                        if(err) res.status(500).json("Something went wrong.")
                        else if(!user) res.status(400).json("User not found")
                        else{
                            if(user.archived_class.includes(__class._id)){
                                for(let i = 0; i< user.archived_class.length; i++){
                                    if(String(user.archived_class[i]) === String(__class._id)) {user.archived_class.splice(i, 1); i-- }
                                }
                            }
                            user.save()
                            .then(() => res.json("Success"))
                            .catch(() => res.status(400).json("Something went wrong."))
                        }
                    })
                }
            })
        }
        else{
            User.findOne({_id: student, token}, (err, user) => {
                if(err) res.status(500).json("Something went wrong.")
                else if(!user) res.status(400).json("User not found")
                else{
                    if(user.archived_class.includes(__class._id)){
                        for(let i = 0; i< user.archived_class.length; i++){
                            if(String(user.archived_class[i]) === String(__class._id)) {user.archived_class.splice(i, 1); i-- }
                        }
                    }
                    user.save()
                    .then(() => res.json("Success"))
                    .catch(() => res.status(400).json("Something went wrong."))
                }
            })
        }
    })
}
module.exports = {
    GetClass,
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
    UserUnarchive
}
