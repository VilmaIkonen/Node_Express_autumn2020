'use strict';

const { turtleDataStorage } = require('./jsonStorage/dataStorageLayer');
const storage = turtleDataStorage();

// // Testing that connections between files Ok, can print out messages from messages.js
// console.log(storage.messages);

// // Testing that getAll gets all turtle data from Ikonen_Vilma_turtles.json
// storage.getAll().then(kilpparit => console.log(kilpparit))

// // Testing that getFromStorage gets a turtle data with turtle number from Ikonen_Vilma_turtles.json
// storage.get(2).then(kilppari => console.log(kilppari)).catch(virhe => console.log(virhe));

// // Testing that errormessage works for getFromStorage
// storage.get(222).then(kilppari => console.log(kilppari)).catch(virhe => console.log(virhe));

// // Testing that insert works
// storage.insert({
//     "number": 123,
//     "name": "Maryx",
//     "age": 15,
//     "speed": "sluggish",
//     "weightKg": 87
//   }).then(status => console.log(status)).catch(error => console.log(error));

// Testing that remove works
storage.remove(123).then(result => console.log(result)).catch(virhe => console.log(virhe));

