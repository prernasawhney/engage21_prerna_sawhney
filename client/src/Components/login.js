import React, { useState } from "react";
import Axios from "axios";
import Cookies from "universal-cookie";
import { NavLink } from "react-router-dom";
import { Button, Container, TextField } from "@mui/material";

const URL = process.env.REACT_APP_BACKEND_URL;
const Login = () => {
   
    const [error, setError] = useState('');
    const [data,setData]=useState({email:'',password:''});
    
    const handleChange = (e) => {
        const {name , value} = e.target   
        setData(prevState => ({
            ...prevState,
            [name] : value
        }))
    }
  
    const Submit = (e) => {
        e.preventDefault();

        Axios.post(`${URL}/users/login`, data)
        .then(res => {
            const token = new Cookies();
            token.set('token', res.data.token, {path: '/', maxAge:604800 })
            //return to home page
            window.location = "/";
        })
        .catch(err => setError(err.response.data))
    }

    return(
        <Container maxWidth="sm">
            <form className="box-shadow text-dark" onSubmit={Submit}>
                <h1 className="box-title">Login user</h1>
                <h4 className="form-error">{error}</h4>
                <div className="form-group">
                    <TextField name="email" variant="outlined" label="email" type="email" value={data.email} onChange = {handleChange} />
                </div>
                <div className="form-group">
                    <TextField name="password" type="password" variant="outlined"  label="password"  onChange = {handleChange}/>
                </div>
                <div className="form-group">
                    <p className = "form-label">Don't have account yet? <Button color="success"> <NavLink to="/register" className="link">Register</NavLink></Button></p>
                </div>
                <div className="form-group">
                <Button variant="contained" color="success" type="submit">Login</Button>
                </div>
            </form>
        </Container>
    )
}

export default Login;