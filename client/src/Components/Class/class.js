import React, { useEffect, useState } from "react";

import Axios from "axios";
import ClassIcon from '@mui/icons-material/Class';
import ClassNavbar from "../Navbar/class.navbar";
import { Container } from "@mui/material";
import DefaultProfile from "../../Icons/profile.png";
import InfoById from "../../Library/InfoById";

const URL = process.env.REACT_APP_BACKEND_URL;

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


const Class = (params) => {
    const [classInfo, setClassInfo] = useState({});
    const [classworks, setClassworks] = useState([]);
    const [authorInfo, setAuthorInfo] = useState({});

    useEffect(() => {
        const classId = params.match.params.classId;
        Axios.get(`${URL}/class/get/class/${classId}`)
        .then(res => setClassInfo(() => res.data))
    }, [params.match.params.classId])

    useEffect(() => document.title = classInfo.title, [classInfo])

    useEffect(() => {
        if(classInfo._id){
            Axios.get(`${URL}/classwork/class/get/${classInfo._id}`)
            .then(res => setClassworks(res.data))
        }
    }, [classInfo])

    useEffect(() => {
        if(classworks.length > 0){
            classworks.forEach(classwork => {
                InfoById(classwork.author)
                .then(result => setAuthorInfo(prev => ({...prev, [classwork.author]: result})))
            })
        }
    }, [classworks])

    return(
        <div>
            <ClassNavbar classInfo={classInfo} />
           <Container maxWidth="lg">
                <Container maxWidth="sm" className="box box-shadow">
                    <h1 className="box-title"><ClassIcon/>{classInfo.title}</h1>
                    <p className="box-text classinfo-description">{classInfo.description}</p>
                    <h4 className="box-shadow">Class code: {classInfo.code}</h4>
                </Container>
                {Object.size(authorInfo) > 0? classworks.map(classwork => {
                    if(authorInfo[classwork.author]){
                    return <div className="box box-shadow " key = {classwork._id} onClick = {() => {
                        if(classwork.types === "material") window.location = `/class/${classInfo._id}/m/${classwork._id}`
                        else if(classwork.types === "announcement") window.location = `/class/${classInfo._id}/an/${classwork._id}`
                        else if(classwork.types === "assignment") window.location = `/class/${classInfo._id}/ag/${classwork._id}`
                        }}>
                       
                        <h3 className="classwork-title">
                        {authorInfo[classwork.author].profile_picture?
                        <img src = { `${URL}/${authorInfo[classwork.author].profile_picture.filename}`} alt = "Author" className="pp" />
                        :<img src = { DefaultProfile} alt = "Author" className="pp" />}
                        &nbsp;{authorInfo[classwork.author].username} posted a new {classwork.types}: 
                        &nbsp;{classwork.title}</h3>
                        <p>{classwork.description}</p>
                    </div>} else return null;
                }): null}
           </Container>
        </div>
    )
}

export default Class;