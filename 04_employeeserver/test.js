'use strict';

const { createDataStorage } = require('./jsonStorage/dataStorageLayer');
const storage = createDataStorage();

// console.log(storage.CODES);

// storage.getAll().then(employees => console.log(employees));

storage.get(1).then(employee => console.log(employee)).catch(err => console.log(err));

storage.get(12).then(employee => console.log(employee)).catch(err => console.log(`${err.message}, Error type: ${err.type}, error code: ${err.code}`));;