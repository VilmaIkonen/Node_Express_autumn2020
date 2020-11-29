'use strict';

const http = require('http');
const path = require('path');

const express = require('express');
const app = express();

const { port, host, storage } = require('./serverConfig.json');

const { turtleDataStorage } = require(path.join(__dirname, storage.storageFolder, storage.dataLayer));

const turtleStorage = turtleDataStorage();

const server = http.createServer(app);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'pages'));

// middlewares
app.use(express.urlencoded({ extended: false})); // This object will contain key-value pairs, where the value can be a string or array (when extended is false), or any type (when extended is true)
app.use(express.static(path.join(__dirname, 'public'))); // The root argument specifies the root directory from which to serve static assets

const homePath = path.join(__dirname, 'home.html');


// GET methods START //

// To home page
app.get('/', (req, res) => res.sendFile(homePath));


// To all turtles -page
app.get('/all', (req, res) => turtleStorage.getAll()
.then(data => res.render('getall', { result: data.map(turtle => createTurtle(turtle))})))

// To getone page 
app.get('/getone', (req, res) => res.render(
  'getone', {
    // title: 'Find a turtle',
    // header: 'Find a turtle',
    action: '/getone'
  }
));

// Posting request from getone page
app.post('/getone', (req, res) => {
  if(!req.body) res.sendStatus(500);

  const turtleNumber = req.body.turtleNumber;
  turtleStorage.get(turtleNumber)
  .then(turtle => res.render('turtlepage', {
    result:createTurtle(turtle)}))
  .catch(error => sendErrorPage(res, error)) 
})

// GET methods END //

// Creating server
server.listen(port, host, () => console.log(`Server ${host}: ${port} running`));

// Function for sending the error page
function sendErrorPage(res, error, title='Error', header='Error') {
  sendStatusPage(res, error, title, header);
}

// Function for sending status page 
function sendStatusPage(res, status, title='Status', header='Status') {
  return res.render('statuspage', { title, header, status });
}

// Function for creating one turtle
function createTurtle(turtle) {
  return {
    number: turtle.number,
    name: turtle.name,
    age: turtle.age,
    speed: turtle.speed,
    weightKg: turtle.weightKg
  }
}