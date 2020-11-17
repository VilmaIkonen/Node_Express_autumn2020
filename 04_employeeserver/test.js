'use strict';

const { createDataStorage } = require('./jsonStorage/dataStorageLayer');
const storage = createDataStorage();

// console.log(storage.CODES);

// storage.getAll().then(employees => console.log(employees));

// storage.get(1).then(employee => console.log(employee));

storage.get(12).then(employee => console.log(employee));