import { Button, Container } from "@mui/material";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import UserInfo from "../../Library/UserInfo";
import HomeNavbar from "../Navbar/home.navbar";
const URL = process.env.REACT_APP_BACKEND_URL;
const JoinClass = () => {
    const [inputCode, setInputCode] = useState('');
    const [inputTitle, setInputTitle] = useState('');
    const [inputDescription, setInputDescription] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const [createError, setCreateError] = useState('');
    const [joinError, setJoinError] = useState('');
    const token = new Cookies().get("token");

    useEffect(() => {
        const token = new Cookies().get("token");
        UserInfo(token).then(result => {if(result) setUserInfo(result); else window.location = "/"})
    }, [])

    useEffect(() => {
        if(inputTitle.length > 100) setCreateError("Title length must less or equal to 100")
        else{
            if(inputDescription.length > 500) setCreateError("Description length must less or equal to 500")
            else setCreateError('');
        }
    }, [inputTitle, inputDescription])

    const openJoinTab = () => {
        document.querySelector("#join-class").style.display = "block";
        document.querySelector("#create-class").style.display = "none";
    }
    const openCreateTab = () => {
        document.querySelector("#join-class").style.display = "none";
        document.querySelector("#create-class").style.display = "block";
    }

    const CreateClass = e => {
        e.preventDefault();
        if(createError === ""){
            Axios.post(`${URL}/class/create`, {title: inputTitle, description: inputDescription, token, owner: userInfo._id})
            .then(res => window.location = `/class/${res.data.classId}`)
            .catch(() => setCreateError("Something went wrong."))
        }
    }

    const JoinClass = e => {
        e.preventDefault();
        if(joinError === ""){
            Axios.post(`${URL}/class/students/register`, {token: token, _class: inputCode, student: userInfo._id})
            .then(res => window.location = `/class/${res.data.classId}`)
            .catch((err) => setJoinError(err.response.data+" Please refresh"))
        }
    }

    return(
        <div >
            <HomeNavbar />
            <Container maxWidth="sm">
                <div className="box box-shadow" >
                    <Button color="secondary" onClick = {openJoinTab}>Join class</Button>
                    <Button color="success" onClick = {openCreateTab}>Create class</Button>
                    <div className="box-text">
                        <form id = "join-class" onSubmit = {JoinClass}>
                        <h1 className="box-title">Join a class</h1>
                        <h4 className="form-error">{joinError}</h4>
                            <div className="form-group">
                                <p className="form-label">Input a class code:</p>
                                <input type = "text" className = "form-control" value = {inputCode} onChange = {({target: {value}}) => setInputCode(value)} />
                            </div>
                            <div className="form-group">
                            <Button type="submit" variant="contained" color="success">Join class</Button>
                            </div>
                        </form>
                        <form id = "create-class"  style={{display: "none"}} onSubmit = {CreateClass}>
                            <h1 className="box-title">Create class</h1>
                            <h4 className="form-error">{createError}</h4>
                            <div className="form-group">
                                <p className="form-label">Class title:</p>
                                <input type ="text" className="form-control" value = {inputTitle} onChange = {({target: {value}}) => setInputTitle(value)} />
                            </div>
                            <div className="form-group">
                                <p className="form-label">Class description:</p>
                                <textarea className="form-control" value = {inputDescription} onChange = {({target: {value}}) => setInputDescription(value)} />
                            </div>
                            <div className="form-group">
                               <Button type="submit" variant="contained" color="success">Create class</Button>
                               
                            </div>
                        </form>
                    </div>
                </div>
          </Container>
        </div>
    )
}

export default JoinClass;