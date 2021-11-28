import React, { useEffect, useState } from "react";
import UserInfo from "../../Library/UserInfo";
import Cookies from "universal-cookie";
import HomeNavbar from "../Navbar/home.navbar";
import DefaultProfilePicture from "../../Icons/profile.png";
import Axios from "axios";
import { Button, Container, Typography } from "@mui/material";

const URL = process.env.REACT_APP_BACKEND_URL;
const Profile = () => {
    const [userInfo, setUserInfo] = useState('');
    const [profile, setProfile] = useState(null);
    const [info, setInfo] = useState('');

    useEffect(() => {
        const token = new Cookies().get('token');
        UserInfo(token).then((res) =>{if(res) setUserInfo(res); else window.location = "/"})
    }, [])

    useEffect(() => {
        if(userInfo){
            if(userInfo.profile_picture) setProfile(`${URL}/${userInfo.profile_picture.filename}`)
        }
    }, [userInfo])

    const ChangeProfilePicture = (e) => {
        const token = new Cookies().get('token');
        setInfo("Uploading image...");
        const formData = new FormData();
        if(e.target.files[0]){
            formData.append('myfile', e.target.files[0]);
            formData.append('token', token);
            const config = {
                headers: {
                    'content-type': 'multipart/form-data',
                }
            };
            Axios.post(`${URL}/users/profile_picture`, formData, config)
            .then((res) => {
                setProfile(`${URL}/${res.data}`);
                setInfo("");
            })
        }
    }

    return(
        <div className="container-fluid">
            <HomeNavbar />
           <Container maxWidth="sm"> 
                <div className=" box-shadow text-dark">
                <h1 className="box-title">Your account information:</h1>
                <h4>{info}</h4>
                    <div className="center">
                        <label htmlFor = "upload-profile-picture">
                            {profile === null
                            ?<img src={DefaultProfilePicture} className="profile-pp" alt="Default Profile Logo" title="Click to change" />
                            :<img src={profile} className="profile-pp" alt="Profile Logo" title="Click to change" />
                            }
                        </label>
                    <input type = "file" id="upload-profile-picture" accept = "image/*" onChange = {ChangeProfilePicture} />
                    </div>
                    <Typography >Username: {userInfo.username}</Typography>
                    <Typography>Email: {userInfo.email}</Typography>
                    <Typography>Password: Your password</Typography>
                    <h4>
                     <Button href="/profile/edit" color="secondary">Edit Profile</Button>
                     <Button href="/logout" color="success">Logout</Button></h4>
                </div>
            </Container>
        </div>
    )
}

export default Profile;