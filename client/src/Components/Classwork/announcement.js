import Axios from "axios";
import React, { useEffect, useState } from "react";
import ClassNavbar from "../Navbar/class.navbar";
import moment from "moment";
import InfoById from "../../Library/InfoById";
import UserInfo from "../../Library/UserInfo";
import Cookies from "universal-cookie";
import { Button, Container } from "@mui/material";
const URL = process.env.REACT_APP_BACKEND_URL;

const Announcement = (params) => {
    const [classInfo, setClassInfo] = useState('');
    const [classwork, setClasswork] = useState('');
    const [userInfo, setUserInfo] = useState('');
    const [inputTitle, setInputTitle] = useState('');
    const [inputDescription, setInputDescription] = useState('');
    const [inputFile, setInputFile] = useState();
    const [author, setAuthor] = useState('');
    const classId = params.match.params.classId;
    const classworkId = params.match.params.classworkId;
    const classworkModal = document.getElementById("classwork");

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
            if(res.data.types === "announcement"){
                setClasswork(() => res.data);
                setInputTitle(res.data.title);
                setInputDescription(res.data.description);
            }else window.location = `/class/${classId}`
        })
        .catch(() => window.location = `/class/${classId}`)
    }, [classworkId, classId])

    useEffect(() => {
        if(classwork.author){
            InfoById(classwork.author)
            .then(result => setAuthor(result.username))
        }
    }, [classwork])

    const openClasswork = () => classworkModal.style.display = "block";

    const closeClasswork = () => classworkModal.style.display = "none";

    const deleteClasswork = () => {
        if(window.confirm("Are you sure?")){
            const token = new Cookies().get('token');
            Axios.post(`${URL}/classwork/delete/${classwork._id}`, {author: userInfo._id, token})
            .then(() => window.location = `/class/${classId}`)
        }
    }
    const handleChange=(event)=>{
        setInputFile(event.target.files[0]);
   }

    const updateClasswork = e => {
        e.preventDefault();
        const token = new Cookies().get('token');
        const formData=new FormData();
        formData.append('title', inputTitle);
        formData.append('description',inputDescription);
        formData.append('attachment',inputFile);
        formData.append('token',token);

        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            }
        };
        Axios.post(`${URL}/classwork/update/${classwork._id}`, formData,config)
        .then(res => {
            setClasswork(res.data.classwork);
            classworkModal.style.display = "none";
        })
    }

    return(
        <div className="container-fluid">
            <ClassNavbar classInfo = {classInfo} />
            <div className="container">
                <Container maxWidth="sm" className="box-shadow"> 
                        <h1 className="box-title">{classwork.title}</h1>
                        {classwork.duedate?<p>Due: {moment(classwork.duedate).fromNow()}</p>:null}
                        <p className="box-text material-description">{classwork.description}</p>
                        <p>Points:{classwork.points}</p>
                          {classwork.attachment?
                          <Button color="success" target="_blank" variant="contained" href={classwork.attachment && (URL + '/assignments/' + classwork.attachment.filename)}> 
                          attachment </Button>:null}
                        <p>posted {moment(classwork.createdAt).fromNow()} 
                        {classwork.createdAt !== classwork.updatedAt? <span>(updated {moment(classwork.updatedAt).fromNow()})</span>: null} by {author}</p>
                        {classwork.author === userInfo._id? <div><h3><span className="link" onClick = {openClasswork}>Edit</span></h3>
                        <h3><span className="link text-danger" onClick = {deleteClasswork}>Delete</span></h3></div>:null}
                
                </Container>
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
                             <p className="form-label">Attachment:</p>
                             <input type="file" className="form-control" onChange={handleChange}/>
                        </div>
                        <div className="form-group">
                            <input type = "submit" className="form-control btn btn-dark" />
                        </div>
                    </form>
                </div>
            </div>:null}
        </div>
    )
}

export default Announcement;