import Axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import UserInfo from "../../Library/UserInfo";
import DefaultProfile from "../../Icons/profile.png";
import {NavLink} from "react-router-dom"
import WorkIcon from '@mui/icons-material/Work';
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import ClassIcon from '@mui/icons-material/Class';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import ArchiveIcon from '@mui/icons-material/Archive';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
const URL = process.env.REACT_APP_BACKEND_URL;

const ClassNavbar = ({classInfo}) => {
    const [userInfo, setUserInfo] = useState('');
    const [classes, setClasses] = useState([]);
    const [Profile, setProfile] = useState(null);

    useEffect(() => {
        const token = new Cookies().get('token');
        UserInfo(token).then(result => {
            if(!result) window.location = "/"
            setUserInfo(result);
            if(result.profile_picture) setProfile(`${URL}/${result.profile_picture.filename}`)
        });
    }, [])

    useEffect(() => {
        if(userInfo){
            Axios.get(`${URL}/class/get/created/${userInfo._id}`)
            .then(res => {
                res.data.forEach(_class => {
                    setClasses(classes => [...classes, _class])
                })
            })
            Axios.get(`${URL}/class/get/taught/${userInfo._id}`)
            .then(res => {
                res.data.forEach(_class => {
                    setClasses(classes => [...classes, _class])
                })
            })
            Axios.get(`${URL}/class/get/studied/${userInfo._id}`)
            .then(res => {
                res.data.forEach(_class => {
                    setClasses(classes => [...classes, _class])
                })
            })
        }
    }, [userInfo])

    const openNav = () => document.getElementById("sidenav").style.width = "250px";

    const CloseNav = () => document.getElementById("sidenav").style.width = "0px";

    return(
        <nav>
            <nav className='bg-white text-dark topnav'>
                <div id = "sidenav" className="sidenav">
                    <span className="closebtn nav-ham" onClick={CloseNav}>&times;</span>
                    <NavLink to="/" className="sidenav-title"><HomeIcon/>Classes</NavLink>
                    {classes.map(_class => {
                        if(!_class.archived && !userInfo.archived_class.includes(_class._id)){
                            return <NavLink to = {`/class/${_class._id}`} key={_class._id} className="sidenav-item"><ClassIcon/>{_class.title}</NavLink>
                        }else return null;
                    })}
                    <NavLink to = "/archived" className="sidenav-title"><ArchiveIcon/> Archived Class</NavLink>
                </div>
                <span className="nav-logo  nav-ham" onClick = {openNav}>☰</span>
                <p className="nav-logo nav-ham nav-class-title" onClick = {() => window.location = `/class/${classInfo._id}`}>{classInfo.title}</p>
                {Profile === null
                ?<img src = {DefaultProfile} alt="Default Profile Logo" className="nav-right pp nav-ham" onClick = {() => window.location = "/profile"}></img>
                :<img src = {Profile} alt="Profile Logo" className="nav-right pp nav-ham" onClick = {() => window.location = "/profile"}></img>
                }
            </nav>
            {Object.keys(classInfo).length > 0 && classInfo.owner === userInfo._id?
                <nav className="center bg-white text-dark topnav">
                    <p className="col-3 option nav-ham"><NavLink to = {`/class/${classInfo._id}`} className=" link"><ViewStreamIcon/> Stream</NavLink></p>
                    <p className="col-3 option nav-ham"><NavLink to = {`/class/${classInfo._id}/classwork`} className="link"><WorkIcon/> Classwork</NavLink></p>
                    <p className="col-3 option nav-ham"><NavLink to = {`/class/${classInfo._id}/people`} className="link"><PeopleIcon/> People</NavLink></p>
                    <p className="col-3 option nav-ham"><NavLink to = {`/class/${classInfo._id}/setting`} className ="link"><SettingsSuggestIcon/> Setting</NavLink></p>
                </nav>
            : <nav className="center bg-white text-dark topnav">
                <p className="col-4 nav-ham optc"><NavLink to = {`/class/${classInfo._id}`} className=" link"><ViewStreamIcon/> Stream</NavLink></p>
                <p className="col-4 nav-ham optc"><NavLink to = {`/class/${classInfo._id}/classwork`} className="link"><WorkIcon/>Classwork</NavLink></p>
                <p className="col-4 nav-ham optc"><NavLink to = {`/class/${classInfo._id}/people`} className="link"><PeopleIcon/> People</NavLink></p>
            </nav>}
        </nav>
    )
}

export default ClassNavbar;