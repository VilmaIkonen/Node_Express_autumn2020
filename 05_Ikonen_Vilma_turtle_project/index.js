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

// To getone page 
app.get('/getone', (req, res) => res.render(
  'getone', {
    // title: 'Find a turtle',
    // header: 'Find a turtle',
    action: '/getone'
  }
));

// GET methods END //

server.listen(port, host, () => console.log(`Server ${host}: ${port} running`));