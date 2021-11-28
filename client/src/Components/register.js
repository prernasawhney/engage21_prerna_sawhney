import Axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { NavLink } from "react-router-dom";
import { Button, Container,TextField } from "@mui/material";

const URL = process.env.REACT_APP_BACKEND_URL;
const Register = () => {
    const [inputEmail, setInputEmail] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [inputPasswordConfirmation, setInputPasswordConfirmation] = useState('');
    const [inputUsername, setInputUsername] = useState('');
    const [error, setError] = useState([]);

    //Register the user
    const Submit = async (e) => {
        e.preventDefault();

        if(error === ""){
            await Axios.post(`${URL}/users/register`, {email: inputEmail, username: inputUsername, password: inputPassword})
            .then(res => {
                const token = new Cookies();
                token.set('token', res.data.token, {path: '/', maxAge:604800 })
                //return to home page
                window.location = "/";
            })
            .catch(err => setError(err.response.data));
        }
    
    }

    useEffect(() => {
        if(inputEmail.length > 0) setError('');
    }, [inputEmail])

    //validating users' input
    useEffect(() => {
        if(inputPassword.length<6&& inputPassword.length !== 0) setError("Password must be atleast 6 character");
        else {
            if(inputUsername.length < 2 && inputUsername.length !== 0) setError("Username length should be more than or equal to 2");
            else if(inputUsername.length > 50) setError('Username length should be less or equal to 50');
            else if(inputPassword !== inputPasswordConfirmation) setError("Password and confirmation must match.")
            else setError('');
        }
    }, [inputPassword, inputPasswordConfirmation, inputUsername])

    return (
        <Container maxWidth="sm">
            <form className=" box-shadow text-dark" onSubmit={Submit}>
                <h1 className="box-title">Register user</h1>
                <h4 className="form-error">{error}</h4>
                <div className="form-group">
                    
                    <TextField type="text" label="username"variant="outlined" name="username" value={inputUsername} onChange={({target: {value}}) => setInputUsername(value)} />
                </div>
                <div className="form-group">
                    <TextField label="email"variant="outlined" name="email"type="email" value={inputEmail} onChange = {({target: {value}}) => setInputEmail(value)} />
                </div>
                <div className="form-group">
                    <TextField label="password"variant="outlined" name="password" type="password" value={inputPassword} onChange= {({target: {value}}) => setInputPassword(value)} />
                </div>
                <div className="form-group">
                    <TextField label="password confirmation"variant="outlined"type="password"  name="password confirmation" value={inputPasswordConfirmation} onChange= {({target: {value}}) => setInputPasswordConfirmation(value)} />
                </div>
                <div className="form-group">
                    <p className = "form-label">Already have account?<Button color="success"> <NavLink to="/login" className="link">Login</NavLink></Button></p>
                </div>
                <div className="form-group">
                <Button variant="contained" color="success" type="submit">Register</Button>
                </div>
            </form>
       </Container>
    )
}

export default Register;