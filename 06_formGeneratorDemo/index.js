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

// require fields.json 
const fields = require('./fields.json');

// ----- CONFIGURATION END ----- //

// app get routes
app.get('/', (req, res) => {  
  res.render('menu', {language: 'en', title: 'Menu', header: 'Menu'})
})
// getting different language form based on browser language, menu.html parametrized values
app.route('/en')
  .get((req, res) => res.render('form', {
    language: 'en',
    title: 'Data',
    header: 'Fill',
    menuLabel: 'Menu'
}));


server.listen(port, host, () => console.log(`Listening ${host}: ${port}`));