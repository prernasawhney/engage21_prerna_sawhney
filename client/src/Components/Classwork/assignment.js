import Axios from "axios";
import React, { useEffect, useState } from "react";
import ClassNavbar from "../Navbar/class.navbar";
import moment from "moment";
import InfoById from "../../Library/InfoById";
import UserInfo from "../../Library/UserInfo";
import Cookies from "universal-cookie";
import { Button, Container } from "@mui/material";
const URL = process.env.REACT_APP_BACKEND_URL;

const Assignment = (params) => {
    const [answered, setAnswered] = useState(false);
    const [classInfo, setClassInfo] = useState('');
    const [classwork, setClasswork] = useState('');
    const [userInfo, setUserInfo] = useState('');
    const [inputTitle, setInputTitle] = useState('');
    const [inputDescription, setInputDescription] = useState('');
    const [inputPoints, setInputPoints] = useState(100);
    const [inputFile, setInputFile] = useState('');
    const [inputAnswer, setInputAnswer] = useState('');
    const [inputDeadline, setInputDeadline] = useState('');
    const [author, setAuthor] = useState('');
    const [answers, setAnswers] = useState([]);
    const [myAnswer, setMyAnswer] = useState({});
    const classId = params.match.params.classId;
    const classworkId = params.match.params.classworkId;
    const classworkModal = document.getElementById("classwork");
    const answerModal = document.getElementById("answers");

    useEffect(() => {
        const token = new Cookies().get('token');
        UserInfo(token)
        .then(result => setUserInfo(result))
    }, [])

    useEffect(() => {
        Axios.get(`${URL}/class/get/class/${classId}`)
        .then(res => setClassInfo(() => res.data))
    }, [classId])

    useEffect(() => {
        Axios.get(`${URL}/classwork/get/${classworkId}`)
        .then(res => {
            if(res.data.types === "assignment"){
                setClasswork(() => res.data);
                setInputTitle(res.data.title);
                setInputDescription(res.data.description);
                if(res.data.duedate) setInputDeadline(res.data.duedate.substr(0, 16));
            }else window.location = `/class/${classId}`
        })
        
    }, [classworkId, classId])

    useEffect(() => {
        if(classwork.author){
            InfoById(classwork.author)
            .then(result => setAuthor(result.username))
        }
    }, [classwork])

    useEffect(() => {
        Axios.get(`${URL}/classwork/get/answer/${classworkId}`)
        .then(res => setAnswers(res.data))
    }, [classworkId])

    useEffect(() => {
        const scan = (answers, userInfo)=>{
            let _answered = false
            answers.forEach(answer => {
                if(answer.student._id === userInfo._id) _answered = true
                setMyAnswer(answer);

            })
            return _answered
        }
        setAnswered(scan(answers, userInfo))
    }, [answers, userInfo])

    const openClasswork = () => classworkModal.style.display = "block";

    const closeClasswork = () => classworkModal.style.display = "none";

    const deleteClasswork = () => {
        if(window.confirm("Are you sure?")){
            const token = new Cookies().get('token');
            Axios.post(`${URL}/classwork/delete/${classwork._id}`, {author: userInfo._id, token})
            .then(() => window.location = `/class/${classId}`)
        }
    }
    const handleUpdateChange=(event)=>{
        setInputFile(event.target.files[0]);
   }

    const updateClasswork = e => {
        e.preventDefault();
        const token = new Cookies().get('token');
        const formData=new FormData();
        formData.append('title', inputTitle);
        formData.append('description',inputDescription);
        formData.append('duedate' ,inputDeadline);
        formData.append('points',inputPoints);
        formData.append('attachment',inputFile);
        formData.append('token',token);

        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            }
        };
        Axios.post(`${URL}/classwork/update/${classwork._id}`,formData,config)
        .then(res => {
            setClasswork(res.data.classwork);
            classworkModal.style.display = "none";
        })
    }
    const handleChange=(event)=>{
        setInputAnswer(event.target.files[0]);
        
   }

    const Answer = e => {
        e.preventDefault();
        const token = new Cookies().get('token');
        const formData=new FormData();
        formData.append('classwork', classwork._id);
        formData.append('token',token);
        formData.append('answer', inputAnswer);
        formData.append('student', userInfo._id);
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            }}
        if(!answered){
            Axios.post(`${URL}/classwork/submit/answer`,formData,config)
            .then(res => setAnswers(res.data.answers))
        }
    }

    const showAnswer = () => answerModal.style.display = "block";
    const closeAnswer = () => answerModal.style.display = "none";

    return(
        <div className="container-fluid">
            <ClassNavbar classInfo = {classInfo} />
            <div className="container">
                <Container maxWidth="sm" className="box-shadow">  
                    <h1 className="box-title">{classwork.title}</h1>
                    <p>Points:{classwork.points}</p>
                    {classwork.attachment? <Button color="success" target="_blank" variant="contained"  href={classwork.attachment && (URL + '/assignments/' + classwork.attachment.filename)}> attachment </Button>:null}
                    {classwork.duedate?<p>Due: {moment(classwork.duedate).fromNow()}</p>:null}
                    <p className="box-text material-description">{classwork.description}</p>
                    
                    <p>posted {moment(classwork.createdAt).fromNow()} 
                    {classwork.createdAt !== classwork.updatedAt? <span>(updated {moment(classwork.updatedAt).fromNow()})</span>: null} by {author}</p>
                    {classwork.author === userInfo._id? <div><h3><span className="link" onClick = {openClasswork}>Edit</span></h3>
                    <h3><span className="link text-danger" onClick = {deleteClasswork}>Delete</span></h3></div>:null}
                </Container>
                {classInfo.teacher && !(classInfo.teacher.includes(userInfo._id) || classInfo.owner === userInfo._id)?
                <Container maxWidth="sm">
                    {!answered?
                    <form className="box box-shadow" onSubmit = {Answer}>
                        <h1 className="box-title">Your answer:</h1>
                        <div className="form-group">
                        <input type="file" rows="5" className="form-control"  onChange = {handleChange} />
                        </div>
                        <div className="form-group">
                            <input type = "submit" className="form-control btn btn-dark" />
                        </div>
                    </form>:
                    <div className="box box-shadow">
                        <p>You have submitted.</p>
                        <p> your answer
                         <Button color="success" target="_blank" variant="contained"  href={ answers && (URL + '/assignments/' + myAnswer.answer.filename)}>
                          Answer </Button> </p>
                    </div>}
                </Container>:
                <div >
                    <Container maxWidth="sm" className="box box-shadow">
                        <h1 className="box-title">Answers:</h1>
                        <p className="box-text">{classwork.answer?classwork.answer.length:null} answered</p>
                        <button className="form-control btn btn-dark" onClick = {showAnswer}>See answers</button>
                    </Container>
                </div>}
            </div>
            {classwork.author === userInfo._id?
            <div className="classwork-modal" id="classwork">
                <div className="classwork-content container">
                    <span className="classwork-close" onClick = {closeClasswork}>&times;</span>
                    <h1 className="box-title">Update classwork</h1>
                    <form onSubmit = {updateClasswork}>
                        <div className="form-group">
                            <p className="form-label">Title:</p>
                            <input type = "text" className = "form-control" value ={inputTitle} onChange = {({target: {value}}) => setInputTitle(value)} required />
                        </div>
                        <div className="form-group">
                            <p className="form-label">Description:</p>
                            <textarea rows="5" type = "text" className="form-control" value={inputDescription} 
                            onChange = {({target: {value}}) => setInputDescription(value)} required />
                        </div>
                        <div className="form-group">
                            <p className="form-label">Due date (optional):</p>
                            <input type = "datetime-local" className="form-control" value={inputDeadline} onChange = {({target: {value}}) => setInputDeadline(value)}
                            min={new Date().toJSON().substr(0, 16)} />
                        </div>
                        <div className="form-group">
                            <p className="form-label">Points:</p>
                            <input type = "number" pattern="[0-9]*" className="form-control" value={inputPoints} onChange = {({target: {value}}) => setInputPoints(value)}/>
                        </div>
                        <div className="form-group">
                             <p className="form-label">attachment:</p>
                             <input type="file" className="form-control" onChange={handleUpdateChange}/>
                        </div>
                        <div className="form-group">
                            <input type = "submit" className="form-control btn btn-dark" />
                        </div>
                    </form>
                </div>
            </div>:null}
            {classInfo.teacher && classwork.author && (classwork.author === userInfo._id || classInfo.teacher.includes(userInfo._id) || classInfo.owner === userInfo._id)?
            <div className = "classwork-modal" id = "answers">
                <div className="classwork-content container">
                    <span className="classwork-close" onClick = {closeAnswer}>&times;</span>
                    <h1 className="box-title">Answers by students:</h1>
                    {answers.map(answer => {
                        return <p key = {answer._id}>{answer.student.username} answered 
                        <b><Button color="success" target="_blank" variant="contained"  href={ (URL + '/assignments/' + answer.answer.filename)}>
                         Answer </Button>
                        </b> {moment(answer.answeredOn).fromNow()}
                        {answer.answeredOn > classwork.duedate? <span><b> (Turned in late)</b></span>:null}</p>
                    })}
                </div>
            </div>
            :null}
        </div>
    )
}

export default Assignment;