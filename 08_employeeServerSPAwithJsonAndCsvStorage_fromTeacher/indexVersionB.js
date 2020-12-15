'use strict';

const http = require('http');
const path = require('path');

const express = require('express');
const app = express();

const {port,host,storage} = require('./serverConfig.json');

const { createDataStorage} = require(path.join( __dirname,
                                                storage.storageFolder,
                                                storage.dataLayer));

const dataStorage = createDataStorage();   

const server = http.createServer(app);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'pageviews'));

app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

const menuPath=path.join(__dirname,'menu.html');

app.get('/', (req,res)=>res.sendFile(menuPath));

app.get('/all', (req,res)=>
    dataStorage.getAll()
        .then(data => 
            res.render('allPersons',{result:data.map(emp=>createPerson(emp))}))
);

app.get('/getPerson', (req,res)=>
    res.render('getPerson', {
        title:'Get',
        header:'Get',
        action: '/getPerson'
    })
);

app.post('/getPerson', (req,res)=>{
    if(!req.body) res.sendStatus(500);
    
    const personId = req.body.personId;
    dataStorage.get(personId)
        .then(employee=>
            res.render('personPage',{result:createPerson(employee)}))
        .catch(error=>sendErrorPage(res,error));
});

app.get('/inputform', (req,res)=>
    res.render('form',{
        title:'Add person',
        header:'Add a new person',
        action:'/insert',
        personId:{value:'', readonly:''},
        firstname:{value:'', readonly:''},
        lastname:{value:'', readonly:''},
        department:{value:'', readonly:''},
        salary:{value:'', readonly:''}
    })
);

app.post('/insert', (req,res)=>{
    if(!req.body) res.sendStatus(500);

    dataStorage.insert(createEmployee(req.body))
        .then(status=> sendStatusPage(res,status))
        .catch(error => sendErrorPage(res,error));
});

app.get('/updateform', (req,res)=>
    res.render('form',{
        title:'Update person',
        header:'Update person data',
        action:'/updatedata',
        personId:{value:'', readonly:''},
        firstname:{value:'', readonly:'readonly'},
        lastname:{value:'', readonly:'readonly'},
        department:{value:'',readonly:'readonly'},
        salary:{value:'', readonly:'readonly'}
    })
);

app.post('/updatedata', async (req,res)=>{
    if(!req.body) {
        res.sendStatus(500);
    }
    else {
        try{
            const personId=req.body.personId;
            const employee = await dataStorage.get(personId);
            const person = createPerson(employee);
            res.render('form', {
                title:'Update person',
                header:'Update person data',
                action:'/updateperson',
                personId:{value:person.personId, readonly:'readonly'},
                firstname:{value:person.firstname, readonly:''},
                lastname:{value:person.lastname, readonly:''},
                department:{value:person.department, readonly:''},
                salary:{value:person.salary, readonly:''}
            });
        }
        catch(error) {
            sendErrorPage(res,error);
        }
    }
});

app.post('/updateperson',(req,res)=>{
    if(!req.body) res.sendStatus(500);
    else dataStorage.update(createEmployee(req.body))
        .then(status=>sendStatusPage(res,status))
        .catch(error=>sendErrorPage(res,error));
});

app.get('/removeperson', (req,res)=>
    res.render('getPerson',{
        title:'Remove',
        header:'Remove a person',
        action:'/removeperson'
    })
);

app.post('/removeperson', (req,res)=>{
    if(!req.body) res.sendStatus(500);
    const personId=req.body.personId;
    dataStorage.remove(personId)
        .then(status=>sendStatusPage(res,status))
        .catch(error=>sendErrorPage(res,error));
});

server.listen(port, host, 
    ()=>console.log(`Server ${host}:${port} running`));

function sendErrorPage(res,error, title='Error', header='Error') {
    sendStatusPage(res, error, title, header);
}

function sendStatusPage(res, status, title='Status', header='Status'){
    return res.render('statusPage', {title,header,status});
}

//from employee to person
function createPerson(employee){
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