'use stirct';

const http = require('http');
const path = require('path');
const express = require ('express');

const app = express();

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

const server = http.createServer(app);

const homePath = path.join(__dirname, 'home.html');
const pageBpath = path.join(__dirname, 'pageB.html');

//with this, access to public folder and eg. styles in it.
app.use(express.static.apply(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.sendFile(homePath));
app.get('/someotherpage', (req, res) => sendFile(pageBpath));

server.listen(port, host, () => console.log(`Server ${host}: ${port} serving`))
