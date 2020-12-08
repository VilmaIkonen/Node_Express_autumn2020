'use strict';

const http = require('http');
const path = require('path');

const express = require('express');
const app = express();

const { port, host, storage } = require('./serverConfig.json');

const { createDataStorage } = require(path.join(__dirname, storage.storageFolder, storage.dataLayer));

const dataStorage = createDataStorage();

const server = http.createServer(app);

// middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// sending home page to server
const homePath = path.join(__dirname, 'home.html');
app.get('/', (req, res) => res.sendFile(homePath));

// routes for data getAll, getPerson, remove, add, update
app.get('/all', (req, res) => 
  dataStorage.getAll()
  .then(result => res.json(result.map(emp => createPerson(emp)))));

app.post('/getperson', (req, res) => {
  if(!req.body) res.sendStatus(500);

  const personId = +req.body.personId; // "+" converts to number
  dataStorage.get(personId)
  .then(emp => res.json(createPerson(emp)))
  .catch(error => sendError(res, error))
})

app.post('/removeperson', (req, res) => {
  if(!req.body) res.sendStatus(500)

  const personId = +req.body.personId;
  dataStorage.remove(personId)
  .then(status => sendStatus(res, status))
  .catch(error => sendError(res, error))
})

app.post('/insertperson', (req, res) => {
  if(!req.body) res.sendStatus(500)
  dataStorage.insert(createEmployee(req.body))
  .then(status => sendStatus(res, status))
  .catch(error => sendError(res, error))
})

app.post('/updateperson', (req, res) => {
  if(!req.body) res.sendStatus(500)
  dataStorage.update(createEmployee(req.body))
  .then(status => sendStatus(res, status))
  .catch(error => sendError(res, error))
})

server.listen(port, host, () => console.log(`Server ${host}: ${port} running`));

function sendError(res, error){
  sendStatus(res, error)
}

function sendStatus(res, status) { 
  return res.json(status);
}

// conversion from employee to person
function createPerson(employee) {
  return {
    personId: employee.employeeId, 
    firstname: employee.firstname,
    lastname: employee.lastname,
    department: employee.department,
    salary: employee.salary
  }
}

// conversion from person to employee
function createEmployee (person) {
  return {
    employeeId: person.personId, 
    firstname: person.firstname,
    lastname: person.lastname,
    department: person.department,
    salary: person.salary

  }
}