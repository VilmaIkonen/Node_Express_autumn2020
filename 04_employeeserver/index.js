'use strict';

const http = require('http');
const path = require('path');

const express = require('express');
const app = express();

const { port, host, storage } = require('./serverConfig.json');

const { createDataStorage } = require(path.join(__dirname, storage.storageFolder, storage.dataLayer));

const dataStorage = createDataStorage();

const server = http.createServer(app);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'pageviews'));

app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

const menuPath = path.join(__dirname, 'menu.html') // menu.html in root folder


// --- GET methods --- //

app.get('/', (req, res) => res.sendFile(menuPath));

// Data is an array of employees. with mapping the conversion of person <--> employee will be done. map does not change original array, makes a copy
app.get('/all', (req, res) => 
  dataStorage.getAll()
  .then(data => res.render('allPersons', {result: data.map(emp => createPerson(emp))})));

app.get('/getPerson', (req, res) => 
  res.render('getPerson', {
    title: 'Get',
    header: 'Get an employee by Id',
    action: '/getPerson'
  })
);

// --- POST methods --- //

app.post('/getPerson', (req, res) => {
  if(!req.body) res.sendStatus(500);

  const personId = req.body.personId;
  dataStorage.get(personId).
    then(employee => res.render('personPage', { result:createPerson(employee) }))
    .catch(error => sendErrorPage(res, error))
})

app.get('/inputform', (req, res) => 
  res.render('form', {
    title: 'Add person',
    header: 'Add a new person',
    action: '/insert',
    personId: { value: '', readonly: ''},
    firstname: { value: '', readonly: ''},
    lastname: { value: '', readonly: ''},
    department: { value: '', readonly: ''},
    salary: { value: '', readonly: ''}
  })
)


server.listen(port, host, () => console.log(`Server ${host}: ${port} running`));

function sendErrorPage(res, error, title='Error', header='Error'){ // default values for header and titl
  sendStatusPage(res, error, title, header);
}

function sendStatusPage(res, status, title='Status', header='Status') { // default values for header and title
  return res.render('statusPage', { title, header, status });
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