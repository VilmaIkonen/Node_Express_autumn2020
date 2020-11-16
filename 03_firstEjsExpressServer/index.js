'use strict';

const http = require ('http');
const path = require('path');
const express = require('express');
const app = express();

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

const server = http.createServer(app);

server.listen(port, host, () => console.log(`Server ${host}: ${port} running.`));