
# Classify

Classify helps to acheive the feel of classroom virtually; 
It is built with frontnd on React.js styling with CSS and material UI,
backend on Node.js,Express.js, database on MongoDB and hosted on oracle server(https).






## Video demo Link : https://www.youtube.com/watch?v=5XC7ibrX4xg


## Features :

1. The user can Register/login 
2. User can view all the currently Loged in classes
3. User can create a class 
4. User can join new classes by the unique code given to all classes
5. Users can Update their profile photo,username and password
6. If user is admin user can promote student to teacher 
7. If user is admin user can demote a teacher to student
8. If user is admin user can remove a teacher or student
9. If user is admin user can update the class information
10. If user is a teacher they can upload anouncement
11. If user is a teacher they can upload material
12. If user is a teacher they can  upload assignment and view studemts answers and see if they turned in late or in time.
13. If user is a teacher they can update or delete the announcement/material, assignment
14. If a user is student they can see the anouncement, material and assignment.
15. If user is a student they can submit their answer to assignment and see their submited answers.
16. If user is a student they can unenroll from the class.
17. Users can archieve or unarchieve a class.


## To run on your local server:

Clone this repository 

Inside server folder, create a new file called .env which stores your ATLAS_URI, SECURITY_KEY and CLIENT_URL information

store your database URI inside ATLAS_URI variable
store your security key inside SECURITY_KEY variable
store your client url inside CLIENT_URL variable

Inside client folder, create a new file called .env which stores your REACT_APP_SECURITY_KEY and REACT_APP_BACKEND_URL informations

store your security key inside REACT_APP_SECURITY_KEY variable, note that this value must same as SECURITY_KEY in server/.env file
store your server url inside REACT_APP_BACKEND_URL variable

## installing all dependencies

Client side: on the client directory type npm install
Server side: on the server directory type npm install

## npm start

Client side: on the client directory type npm start
Server side: on the server directory type npm start
