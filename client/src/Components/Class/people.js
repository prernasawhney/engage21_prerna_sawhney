import Axios from "axios";
import React, { useEffect, useState } from "react";
import InfoById from "../../Library/InfoById";
import ClassNavbar from "../Navbar/class.navbar";
import DefaultProfile from "../../Icons/profile.png";
import PeopleIcon from '@mui/icons-material/People';
import {Container} from '@mui/material';
const URL = process.env.REACT_APP_BACKEND_URL;
const People = (params) => {
    const [classInfo, setClassInfo] = useState({});
    const [teachers, setTeachers] = useState(['']);
    const [students, setStudents] = useState(['']);

    useEffect(() => {
        const classId = params.match.params.classId;
        Axios.get(`${URL}/class/get/class/${classId}`)
        .then(res => setClassInfo(() => res.data))
    }, [params.match.params.classId])

    useEffect(() => {
        if(classInfo){
            InfoById(classInfo.owner)
            .then(result => {
                setTeachers(teachers => [...teachers, result]);
            });
            if(classInfo.teacher){
                (classInfo.teacher).forEach(teacher => {
                    InfoById(teacher)
                    .then(result => {
                        setTeachers(teachers => [...teachers, result])
                    })
                })
            }
            if(classInfo.students){
                (classInfo.students).forEach(student => {
                    InfoById(student)
                    .then(result => setStudents(students => [...students, result]))
                })
            }
        }
    }, [classInfo])

    return(
        <div>
            <ClassNavbar classInfo = {classInfo} />
            <Container maxWidth="md">
                <h1 className="box-title"><PeopleIcon/> Teachers:</h1>
                {teachers.map(teacher => {
                    if(teacher){
                        if(teacher.profile_picture){
                            return <div key={teacher._id} className="box">
                                <img src = {`${URL}/${teacher.profile_picture.filename}`} className="pp" alt={teacher.username} />
                                <b>&nbsp;{teacher.username}</b> <span>({teacher.email})</span>
                                </div>
                        }else{
                            return <div key={teacher._id} className="box">
                                <img src = {DefaultProfile} className="pp" alt={teacher.username} />
                                <b>&nbsp;{teacher.username}</b> <span>({teacher.email})</span>
                                </div>
                        }
                    }else return null;
                })}
                <br/>
                <h1 className="box-title"><PeopleIcon/> Students:</h1>
                {students.map(student => {
                    if(student){
                        if(student.profile_picture){
                            return <div key={student._id} className="box">
                            <img src = {`${URL}/${student.profile_picture.filename}`} className="pp" alt={student.username} />
                            <b>&nbsp;{student.username}</b> <span>({student.email})</span>
                            </div>
                        }
                        else{
                            return <div key={student._id} className="box">
                                <img src = {DefaultProfile} className="pp" alt={student.username} />
                                <b>&nbsp;{student.username}</b> <span>({student.email})</span>
                                </div>
                        }
                    }else return null;
                })}
            </Container>
        </div>
    )
}

export default People;