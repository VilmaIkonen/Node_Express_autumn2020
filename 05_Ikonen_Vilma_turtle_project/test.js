'use strict';

const { turtleDataStorage } = require('./jsonStorage/dataStorageLayer');
const storage = turtleDataStorage();

console.log(storage.messages);
console.log('Hello');


