'use strict';

// ----- CONFIGURATION START ----- //
const http = require('http');
const path = require('path');

// create express
const express = require('express');
const app = express();

const {port, host} = require('./serverConfig.json');

// create server
const server = http.createServer(app);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'pageviews'));

// urlencoded middleware for encoding the form data
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

// require fields.json. Is loaded when server starts. Changes done while server is running, are not visible. Need to rerun server to see changes.
const fields = require('./fields.json');
const fieldsFI = require('./fieldsFI.json');

// ----- CONFIGURATION END ----- //

// app get routes
app.get('/', (req, res) => {  
  // console.log(req.headers['accept-language']); pure Node version
  const lang = req.acceptsLanguages('en', 'fi');
  // console.log(lang);
  if(lang === 'fi') {
    res.render('menu', {
      language: 'fi', 
      title: 'Valikko', 
      header: 'Valikko',
      css: 'menuStyles'
    })
  }
  else {
    res.render('menu', {
      language: 'en', 
      title: 'Menu', 
      header: 'Menu',
      css: 'menuStyles'
    })
  }  
})

// getting different language form based on browser language, menu.html parametrized values
app.route('/en')
  .get((req, res) => res.render('form', {
    language: 'en',
    title: 'Data',
    header: 'Fill',
    menuLabel: 'Menu',
    submitLabel: 'Submit',
    css: 'styles',
    // POST action
    action: '/en', 
    fields
    // fields: fields also valid, but not needed in ES6
}))
  // .post((req, res) => res.json(req.body));
  .post((req, res) => res.render('datapage', {
    language: 'en', 
    title: 'Data', 
    header: 'Data',
    menuLabel:'Menu',
    css: 'styles',
    data: convertToLabelValuePairs(req.body, fields)   
  }))
  
app.route('/fi')
  .get((req, res) => res.render('form', {
    language: 'fi',
    title: 'Tiedot',
    header: 'Syötä tiedot',
    menuLabel: 'Valikko',
    submitLabel: 'Lähetä',
    css:'styles',
    // action for POST
    action: '/fi', 
    fields: fieldsFI    
  }))
  // .post((req, res) => res.json(req.body));
  .post((req, res) => res.render('datapage', {
    language: 'fi', 
    title: 'Tiedot', 
    header: 'Syötit tiedot',
    menuLabel:'Valikko',
    css: 'styles',
    data: convertToLabelValuePairs(req.body, fieldsFI) 
  }))


server.listen(port, host, () => console.log(`Listening ${host}: ${port}`));

// This will give name instead of label to datapage.ejs
function convertToLabelValuePairs(data,fields){
  let labelValues={}
  for(let field of fields) {
      labelValues[field.label]=data[field.name];
  }
  return labelValues;
}