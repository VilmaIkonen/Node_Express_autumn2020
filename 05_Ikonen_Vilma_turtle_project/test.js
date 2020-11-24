'use strict';

const { turtleDataStorage } = require('./jsonStorage/dataStorageLayer.js');
const storage = turtleDataStorage();

console.log(storage.messages);


