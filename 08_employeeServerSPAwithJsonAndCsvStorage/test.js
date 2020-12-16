'use strict';
const {createDataStorage} = require('./jsonStorage/dataStorageLayer');
const storage = createDataStorage();

// console.log(storage.CODES);

// storage.getAll().then(employees=>console.log(employees))

// storage.get(1).then(employee=>console.log(employee)).catch(err=>console.log(err));

// storage.get(12).then(employee => console.log(employee))
    // .catch(err=>console.log(err.message, err.type, err.code));

// storage.insert({
//     "employeeId": 124,
//     "firstname": "Maryx",
//     "lastname": "Riverx",
//     "department": "ictx",
//     "salary": 9000
// }).then(status=>console.log(status)).catch(error=>console.log(error));

// storage.remove(124).then(result=>console.log(result)).catch(err=>console.log(err));

// storage.update({
//     "employeeId": 124,
//     "firstname": "Jesse",
//     "lastname": "River",
//     "department": "ict",
//     "salary": 8000
// }).then(status => console.log(status)).catch(error => console.log(error));