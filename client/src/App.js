import React from "react";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Archived from "./Components/Class/archived";
import Class from "./Components/Class/class";
import Classwork from "./Components/Class/classwork";
import JoinClass from "./Components/Class/join_class";
import People from "./Components/Class/people";
import ClassSetting from "./Components/Class/setting";
import Assignment from "./Components/Classwork/assignment";
import Material from "./Components/Classwork/material";
import Announcement from "./Components/Classwork/announcement";
import ZeroFourZero from "./Components/Error/404";
import Home from "./Components/home";
import Login from "./Components/login";
import Logout from "./Components/logout";
import EditProfile from "./Components/Profile/edit_profile";
import Profile from "./Components/Profile/profile";
import Register from "./Components/register";

const App = () => (
    <Router>
        <Switch>
            <Route exact path = "/" component = {Home} />
            <Route path = "/login" component = {Login} />
            <Route path = "/register" component = {Register} />
            <Route path = "/logout" component = {Logout} />
            <Route path = "/profile/edit" component = {EditProfile} />
            <Route path = "/profile" component = {Profile} />
            <Route path = "/archived" component = {Archived} />
            <Route path = "/class/join" component = {JoinClass} />
            <Route path = "/class/:classId/ag/:classworkId" component = {Assignment} />
            <Route path = "/class/:classId/an/:classworkId" component = {Announcement} />
            <Route path = "/class/:classId/m/:materialId" component = {Material} />
            <Route path = "/class/:classId/classwork" component = {Classwork} />
            <Route path = "/class/:classId/setting" component = {ClassSetting} />
            <Route path = "/class/:classId/people" component = {People} />
            <Route path = "/class/:classId" component = {Class} />
            <Route path = "*" component = {ZeroFourZero} />
        </Switch>
    </Router>
)

export default App;