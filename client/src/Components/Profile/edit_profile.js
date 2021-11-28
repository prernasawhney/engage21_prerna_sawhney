import { Button, Container, TextField } from '@mui/material';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import UserInfo from '../../Library/UserInfo';
import HomeNavbar from '../Navbar/home.navbar';

const URL = process.env.REACT_APP_BACKEND_URL;

const EditProfile = () => {
    const [inputUsername, setInputUsername] = useState('');
    const [inputEmail, setInputEmail] = useState('');
    const [inputOldPassword, setInputOldPassword] = useState('');
    const [inputNewPassword, setInputNewPassword] = useState('');
    const [inputPasswordConfirmation, setInputPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    const [firstError, setFirstError] = useState('');
    const [profileInfo, setProfileInfo] = useState('')
    const [passwordInfo, setPasswordInfo] = useState('');

    useEffect(() => {
        const token = new Cookies().get('token');
        UserInfo(token).then(result => {
            if(result) {
                setInputUsername(result.username)
                setInputEmail(result.email)
            }else window.location = "/"
        })
    }, [])

    useEffect(() => {
        if(inputNewPassword <6 && inputNewPassword.length!==0) setError("Password must contain atleat 6 letters.");
        else if(inputNewPassword !== inputPasswordConfirmation) setError("Password and confirmation must match.");
        else setError('');
    }, [inputNewPassword, inputPasswordConfirmation])

    const updateProfile = (e) => {
        e.preventDefault();
        
        const token = new Cookies().get('token');
        
        Axios.post(`${URL}/users/update`, {token, username: inputUsername, email: inputEmail})
        .then(res => {
            setProfileInfo(res.data.message);
            const token = new Cookies();
            token.set('token', res.data.token, {path: '/', maxAge:604800 })
        })
        .catch(() => setFirstError("Something went wrong. Please refresh and try again."))
    
    }

    const updatePassword = e => {
        e.preventDefault();
        const token = new Cookies().get('token');
        if(error === ""){
        Axios.post(`${URL}/users/password/update`, {token, oldpassword: inputOldPassword, password: inputNewPassword, email: inputEmail})
        .then(res => {
            setPasswordInfo(res.data.message);
            const token = new Cookies();
            token.set('token', res.data.token, {path: '/', maxAge:604800 })
        })
        .catch((err) => setError(err.response.data));
    }
    }

    return(
        <div className="container-fluid">
            <HomeNavbar />
            <Container maxWidth="sm"> 
                <form className="box-shadow text-dark" onSubmit={updateProfile}>
                    <h1 className = "box-title">Update profile</h1>
                    <h4 className="form-error">{firstError}</h4>
                    <h4 className="text-success">{profileInfo}</h4>
                    <div className="form-group">
                     
                       <TextField type = "text" name="username" label="username" variant="outlined" value={inputUsername} onChange = {({target: {value}}) => setInputUsername(value)} />
                    </div>
                    <div className="form-group">
                      
                       <TextField name="email" label="email(cant change)" variant="outlined" type = "email" value={inputEmail} onChange = {({target: {value}}) => setInputEmail(value)} />
                    </div>
                    <div className="form-group">
                      <Button type="submit"variant="contained" color="success">Update Profile</Button>
                    </div>
                </form>
                <form className="box-shadow text-dark" onSubmit = {updatePassword}>
                    <h1 className="box-title">Update Password</h1>
                    <h4 className="form-error">{error}</h4>
                    <h4 className="text-success">{passwordInfo}</h4>
                    <div className="form-group">
                       
                        <TextField name="password" label="password" variant="outlined"  type = "password"value={inputOldPassword} onChange = {({target: {value}}) => setInputOldPassword(value)} />
                    </div>
                    <div className="form-group">
                       
                        <TextField name="newpassword" label="new password" variant="outlined"  type = "password" value={inputNewPassword} onChange = {({target: {value}}) => setInputNewPassword(value)} />
                    </div>
                    <div className="form-group">
                        
                        <TextField name="passwordconfirmation" label="password confirmation" variant="outlined"  type ="password" value = {inputPasswordConfirmation} onChange = {({target: {value}}) => setInputPasswordConfirmation(value)} />
                    </div>
                    <div className="form-group">
                        <Button type="submit"variant="contained" color="success">Update Password</Button>
                    </div>
                </form>
            </Container>
        </div>
    )
}
export default EditProfile;