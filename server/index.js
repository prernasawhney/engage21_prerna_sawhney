// requiring depedencies.
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

//load the environment variable
require('dotenv').config();

//including routers
const userRouter = require('./Router/User/user');
const classRouter = require('./Router/Class/class');
const classworkRouter = require('./Router/Class/classwork');

//Create server for socket.io
const app = express();
const server = http.createServer(app);

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", 'process.env.CLIENT_URL')
	res.setHeader("Access-Control-Allow-Methods", 'GET, POST, DELETE')
    res.setHeader("Access-Control-Allow-Headers", 'Content-Type', "Authorization")
    res.header("Access-Control-Allow-Credentials", true)
	next();
})

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "/public/")));



app.use('/users', userRouter)
app.use('/class', classRouter)
app.use('/classwork', classworkRouter)

if(process.env.NODE_ENV=="production"){
	app.use(express.static("client/build"));
	const path=require("path");
	app.get("*",(req,res)=>{
		res.sendFile(path.resolve(__dirname,'client','build','index.html'));
	})
}


//listening to the port
const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=> console.log(`Server has started on port ${PORT}`));

//connect to mongodb database
const URI = process.env.ATLAS_URI;
mongoose.connect(URI, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
.then(()=>console.log("MongoDB database connection established successfully"))
.catch((error)=>console.log('${error} did not connect'));


//404 error handler
app.use(function (req, res, next) {
	res.status(404).sendFile(__dirname + "/error/404.html")
})
