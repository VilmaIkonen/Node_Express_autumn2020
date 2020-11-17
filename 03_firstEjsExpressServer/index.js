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

// Needed for finding styles and images from public folder
app.use(express.static(path.join(__dirname, 'public')));

const homePath=path.join(__dirname,'home.html');

//getting to homepage
app.get('/', (req,res)=>res.sendFile(homePath));

//posting the data on submit button click. express.urlencoded ()=middleware)... modifies the form data
app.post('/login', express.urlencoded({extended:false}),(req,res)=>{
  console.log(req.body); // with this can check what is returned when submit clicked

    res.render('result', {
    header1:'Your data',
    title:'Form', 
    data: req.body 
    });

  // res.render('result', {
  //   header1:'Your data',
  //   title:'Form', 
  //   data: {
  //       username:req.body.username, 
  //       password:req.body.password
  //   } 
  // });
})

server.listen(port, host, ()=>console.log(`Server ${host}:${port} running`));