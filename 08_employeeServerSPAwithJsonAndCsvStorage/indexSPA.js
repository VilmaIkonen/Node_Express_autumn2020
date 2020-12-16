'use strict';

const http = require('http');
const path = require('path');

const express = require('express');
const app = express();

const { port, host, activeStorage } = require('./mainServerConfig.json');

const { storage, storageLibraries } = require(path.join(__dirname, activeStorage));

const { createDataStorage} = require(path.join( __dirname, storageLibraries.folder, storageLibraries.dataLayer));

const dataStorage = createDataStorage(__dirname, {storage, storageLibraries});   


const server = http.createServer(app);

app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));

const homePath=path.join(__dirname,'home.html');

app.get('/', (req,res)=>res.sendFile(homePath));

app.get('/all', (req,res)=>
    dataStorage.getAll()
        .then(result=>res.json(result.map(emp=>createPerson(emp)))));

app.post('/getperson', (req,res)=>{
    if(!req.body) res.sendStatus(500);
    const personId=+req.body.personId;
    dataStorage.get(personId)
        .then(emp=>res.json(createPerson(emp)))
        .catch(error=>sendError(res,error));
});

app.post('/removeperson', (req,res)=>{
    if(!req.body) res.sendStatus(500);
    const personId=+req.body.personId;
    dataStorage.remove(personId)
        .then(status=>sendStatus(res,status))
        .catch(error=>sendError(res, error));
});

app.post('/insertperson', (req, res) => {
    if (!req.body) res.sendStatus(500);
    dataStorage.insert(createEmployee(req.body))
        .then(status => sendStatus(res, status))
        .catch(error => sendError(res, error));
});

app.post('/updateperson', (req, res) => {
    if (!req.body) res.sendStatus(500);
    dataStorage.update(createEmployee(req.body))
        .then(status => sendStatus(res, status))
        .catch(error => sendError(res, error));
});

server.listen(port, host,
    () => console.log(`Server ${host}:${port} running`));

function sendError(res, error) {
    sendStatus(res, error);
}

function sendStatus(res, status) {
    return res.json(status);
}

//from employee to person
function createPerson(employee) {
    return {
        personId: employee.employeeId,
        firstname: employee.firstname,
        lastname: employee.lastname,
        department: employee.department,
        salary: employee.salary
    }
}
// from person to employee
function createEmployee(person) {
    return {
        employeeId: person.personId,
        firstname: person.firstname,
        lastname: person.lastname,
        department: person.department,
        salary: person.salary
    }
}