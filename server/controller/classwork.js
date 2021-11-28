
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const User = require('../models/user');
const Class = require('../models/class');
const Classwork = require('../models/classwork');
const {nanoid} = require('nanoid');

async function ClassworkCreate(req, res, next) {
    try {
        const {title, description, _class, types, author, duedate, token, options}  = req.body;
        
        User.findOne({_id: author, token}, (err, user) => {
            if(err) res.status(500).json("Something went wrong.")
            else if (!user) res.status(404).json("Author not found.")
            else{
                Class.findOne({_id: _class}, (err, __class) => {
                    if(err) res.status(500).json("Something went wrong.")
                    else if(!__class) res.status(404).json("Class not found.")
                    else{
                        const newClasswork = new Classwork({title, description, class: _class, types: types, duedate, options, author, attachment: req.file})
                        newClasswork.save()
                        .then(
                            () => res.json({message: "Classwork created.", id: newClasswork._id})
                        )
                        .catch(err => { 
                            res.status(400).json("Error: "+err);
                        })
                    }
                })
            }
        })
    } catch (err) {
       
        res.status(422).send({ message: err.message });
    }
}
async function GetClass (req, res) {
    const classId = req.params.class;
    Class.findOne({_id: classId}, (err, _class) => {
        if(err) res.status(500).json("Something went wrong.")
        else if(!_class) res.status(404).json("Class not found.")
        else{
            Classwork.find({class: classId})
            .sort({_id: -1})
            .then(classworks => {
                if(classworks) res.json(classworks)
            })
            .catch(() => res.status(500).json("Something went wrong."))
        }
    })
}
async function GetClassWork (req, res) {
    const classwork = req.params.classwork;
    Classwork.findById(classwork)
    .then(result => res.json(result))
    .catch(() => res.status(404).json("Classwork not found."))
}
async function UpdateClassWork(req, res) {
    const {title, description, duedate, type, points,options, token}  = req.body;
    const id = req.params.id;
    Classwork.findById(id, (err, classwork) => {
        if(err) res.status(500).json("Something went wrong.")
        else if(!classwork) res.status(404).json("Classwork not found.")
        else{
            User.findOne({_id: classwork.author, token}, (err, user) => {
                if(err) res.status(500).json("Something went wrong.")
                else if(!user) res.status(403).json("Permission denied.")
                else{
                    classwork.title = title;
                    classwork.description = description;
                    classwork.duedate = duedate;
                    classwork.type = type;
                    classwork.points=points;
                    classwork.options = options;
                    classwork.attachment=req.file;
                    classwork.save()
                    .then(() => res.json({message:"Success", classwork}))
                    .catch(err => res.status(400).json("Error: "+err));
                }
            })
        }
    })
}

async function DeleteClassWork(req, res)  {
    const {token, author} = req.body;
    const id = req.params.id;
    User.find({token, _id: author}, (err, user) => {
        if(err) res.status(500).json("Something went wrong.")
        else if(!user) res.status(403).json("Permission denied.")
        else{
            Classwork.findByIdAndDelete(id)
            .then(() => res.json("Success"))
            .catch(err => res.status(400).json("Error: "+err));
        }
    })
}
async function  SubmitAnswer(req, res)  {
    const {classwork, student, token} = req.body;
    
    User.findOne({token, _id: student}, (err, user) => {
        if(err) res.status(500).json("Something went wrong.")
        else if(!user) res.status(403).json("Permission denied.")
        else{
            Classwork.findOne({_id: classwork}, (err, classwork) => {
                if(err) res.status(500).json("Something went wrong.")
                else if(!classwork) res.status(404).json("Classwork not found.")
                else{
                    let response = {_id: nanoid(20),student: user, answer: req.file, answeredOn: new Date()};
                    classwork.answer.push(response)
                    classwork.save()
                    .then(() => res.json({message:"Success", answers: classwork.answer}))
                    .catch(err => {console.error(err);
                        res.status(400).json("Error: "+err);
                    }
                        )
                }
            })
        }
    })
}
async function GetAnswer(req, res)  {
    const classworkId = req.params.classwork;
    Classwork.findById(classworkId, (err, classwork) => {
        if(err) res.status(500).json("Something went wrong.")
        else if(!classwork) res.status(404).json("Classwork not found.")
        else res.json(classwork.answer)
    })
}


module.exports ={ 
    ClassworkCreate,
    GetClass,
    GetClassWork,
    UpdateClassWork,
    DeleteClassWork,
    SubmitAnswer,
    GetAnswer
};