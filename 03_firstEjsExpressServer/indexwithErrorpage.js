'use strict';

const http = require('http');
const path = require('path');
const express = require('express');
const app = express();

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

const server=http.createServer(app);

app.set('view engine','ejs');
app.set('views', path.join(__dirname,'pagetemplates'));

const homePath=path.join(__dirname,'home.html');

// Database for users and passwords. 
const users = { 
  matt: '1234',
  mary: 'secret',
  jesse: 'xyz'
}

// Go to homepage
app.get('/', (req,res)=>res.sendFile(homePath));

app.post('/login', express.urlencoded({extended:false}),(req,res)=>{
  const {username, password} = req.body;

  // Checking if the password matches the username
  if(Object.keys(users).includes(username) && users[username] === password) {
    res.render('result', {
    header1:'Your data',
    title:'Form', 
    data: req.body 
    });
  }
  else {
    res.render('errorpage', {username})
  }
  console.log(username, password);
});

// Getting to Users page. 
app.get('/users', (req, res) => res.render('users', {
  title: 'Users', 
  headerA: 'Names',
  usernames: Object.keys(users)
}));

// Getting to cars page (tabledemo)
app.get('/cars', (req, res) => {
  const cars = [
      {"model": "Hoppa", "licence": "ABC-1", "picture": "hoppa.png"},
      {"model": "ModelT", "licence": "A-1", "picture": "modelt.png"},
      {"model": "Hoppa", "licence": "XYZ-12", "picture": "hoppa.png"},
      {"model": "Kaara", "licence": "FGH-897", "picture": "kaara.png"}
  ];
  res.render('tabledemo', {cars});
})

// Getting to cars if -page (tabledemo)
app.get('/carsif', (req, res) => {
  const cars = [
      {"model": "Hoppa", "licence": "ABC-1", "picture": "hoppa.png"},
      {"model": "ModelT", "licence": "A-1", "picture": "modelt.png"},
      {"model": "Hoppa", "licence": "XYZ-12", "picture": "hoppa.png"},
      {"model": "Kaara", "licence": "FGH-897", "picture": "kaara.png"}
  ];
  res.render('tabledemoif', {cars});
})

server.listen(port, host, ()=> console.log(`Server ${host}:${port} running`));