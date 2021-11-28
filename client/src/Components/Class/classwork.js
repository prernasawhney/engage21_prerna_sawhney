import React, { useEffect, useState } from 'react';

import Axios from 'axios';
import { Button } from '@mui/material';
import ClassNavbar from '../Navbar/class.navbar';
import Cookies from 'universal-cookie';
import DefaultProfile from "../../Icons/profile.png";
import InfoById from '../../Library/InfoById';
import UserInfo from '../../Library/UserInfo';

const URL = process.env.REACT_APP_BACKEND_URL;
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


const Classwork = (params) => {
    const [ClassInfo, setClassInfo] = useState({});
    const [userInfo, setUserInfo] = useState(null);
    const [classworks, setClassworks] = useState([]);
    const [authorInfo, setAuthorInfo] = useState({});
    const [type] = useState([
        {label: "Material", value: "material"}, 
        {label: "Anouncement", value: "announcement"},
        {label: "Assignment", value: "assignment"},
    ]);
    const [inputType, setInputType] = useState('material');
    const [inputTitle, setInputTitle] = useState('');
    const [Error, setError] = useState('');
    const [inputFile, setInputFile] = useState();
    const [inputDescription, setInputDescription] = useState('');
    const [inputDeadline, setInputDealine] = useState('');
    const [inputPoints, setInputPoints] = useState('100');
    useEffect(() => {
        const token = new Cookies().get('token');
        UserInfo(token).then(result => {if(result) setUserInfo(result); else window.location = "/login"})
    }, [])

    useEffect(() => {
        const classId = params.match.params.classId;
        Axios.get(`${URL}/class/get/class/${classId}`)
        .then(res => setClassInfo(() => res.data))
    }, [params.match.params.classId])

    useEffect(() => {
        const classId = params.match.params.classId;
        Axios.get(`${URL}/classwork/class/get/${classId}`)
        .then(res => setClassworks(res.data))
    }, [params.match.params.classId])

    useEffect(() => {
        if(classworks.length > 0){
            classworks.forEach(classwork => {
                InfoById(classwork.author)
                .then(result => setAuthorInfo(prev => ({...prev, [classwork.author]: result})))
            })
        }
    }, [classworks])
    
    const openClasswork = () => {
        const classwork = document.getElementById("classwork")
        classwork.style.display = "block";
    }
    const closeClasswork = () => {
        const classwork = document.getElementById("classwork")
        classwork.style.display = "none";
    }
    const handleChange=(event)=>{
         setInputFile(event.target.files[0]);
    }

    const createClasswork = () => {
        const formData=new FormData();
        formData.append('title', inputTitle);
        formData.append('description',inputDescription);
        formData.append('duedate' ,inputDeadline);
        formData.append('points',inputPoints);
        formData.append('attachment',inputFile);
        formData.append('_class' ,ClassInfo._id);
        formData.append('author', userInfo._id);
        formData.append('token',userInfo.token);
        formData.append('types', inputType);


        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            }
        };
        Axios.post(`${URL}/classwork/create`, formData, config )
        .then(result => {
            if(inputType === "material") window.location = `/class/${ClassInfo._id}/m/${result.data.id}`
            else if(inputType === "announcement") window.location = `/class/${ClassInfo._id}/an/${result.data.id}`
            else if(inputType === "assignment") window.location = `/class/${ClassInfo._id}/ag/${result.data.id}`
        })
        .catch(()=> setError("Title Required"))

    }

    return (
        <div className="container-fluid">
            <ClassNavbar classInfo={ClassInfo} />
            <div className="container">
                {Object.size(ClassInfo) > 0 && userInfo!== null && (ClassInfo.owner === userInfo._id || ClassInfo.teacher.includes(userInfo._id))?
                <button className="margin-top-bottom btn btn-dark add-classwork-btn" onClick = {openClasswork}>Add classwork +</button>
                :null}
                {Object.size(authorInfo) > 0? classworks.map(classwork => {
                    if(classwork.types === "assignment" && authorInfo[classwork.author]){
                    return <div className="box box-shadow classwork" key = {classwork._id} onClick = {() => {
                        if(classwork.types === "announcement") window.location = `/class/${ClassInfo._id}/an/${classwork._id}`;
                        else if(classwork.types === "assignment") window.location = `/class/${ClassInfo._id}/ag/${classwork._id}`;
                        }}>
                        <h3 className="classwork-title">
                        {authorInfo[classwork.author].profile_picture?
                        <img src = {`${URL}/${authorInfo[classwork.author].profile_picture.filename}`} alt = "Author" className="pp" />
                        :<img src = { DefaultProfile} alt = "Author" className="pp" />}
                        &nbsp;{authorInfo[classwork.author].username} posted a new {classwork.types}: 
                        &nbsp;{classwork.title}</h3>
                        <p>{classwork.description}</p>
                    </div>
                    }else return null;
                }): null}
            </div>
            <div className="classwork-modal" id="classwork">
                <div className="classwork-content container">
                    <span className="classwork-close" onClick = {closeClasswork}>&times;</span>
                    <h1 className="box-title">Create a classwork</h1>
                    <form>
                    <h3 className="form-error"> {Error}</h3>
                        <div className="form-group">
                            <p className="form-label">Type:</p>
                            <select className="form-control" onChange = {({target: {value}}) => setInputType(value)}>
                                {type.map(item => (
                                    <option key={item.value} value = {item.value}>{item.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <p className="form-label">Title:</p>
                            <input type = "text" className = "form-control" value ={inputTitle} onChange = {({target: {value}}) => setInputTitle(value)} required />
                        </div>
                        <div className="form-group">
                            <p className="form-label">Description(optional):</p>
                            {inputType === "material"?
                            <textarea rows="5" type = "text" className="form-control" value={inputDescription} 
                            onChange = {({target: {value}}) => setInputDescription(value)} required />
                            :<textarea rows="5" type = "text" className="form-control" value={inputDescription} onChange = {({target: {value}}) => setInputDescription(value)}/>
                            }
                        </div>
                        <div className="form-group">
                            <p className="form-label">attachment (optional):</p>
                            <input type = "file" className = "form-control" onChange = {handleChange} />
                        </div>
                        {inputType === "assignment"?
                        <div className="form-group">
                            <p className="form-label">points:</p>
                            <input type = "number" pattern="[0-9]*" className = "form-control" value ={inputPoints} onChange = {({target: {value}}) => setInputPoints(value)}  />
                        </div>:null}
                        {inputType === "assignment"?
                        <div className="form-group">
                            <p className="form-label">Due date (optional):</p>
                            <input type = "datetime-local" className="form-control" value={inputDeadline} onChange = {({target: {value}}) => setInputDealine(value)}
                            min={new Date().toJSON().substr(0, 16)} />
                        </div>:null}
                        <div className="form-group">
                            <Button  variant="contained" color="success" type ="button" onClick={createClasswork} >
                                Submit
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Classwork;