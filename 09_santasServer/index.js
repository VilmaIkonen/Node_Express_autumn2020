'use strict';

const http = require('http');
const path = require('path');
const express = require('express');
const app = express();

const port = process.env.port || 3000;
const host = process.env.host || 'localhost';

const gifts = require('./xmaslist.json');

const server = http.createServer(app);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'pageviews'));

// app.set(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.render('home', {gifts}));

server.listen(port, host, () => console.log(`Server ${host}: ${port} running`));

