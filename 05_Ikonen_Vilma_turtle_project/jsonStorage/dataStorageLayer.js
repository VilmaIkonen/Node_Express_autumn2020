// Data access layer for turtle data //

'use strict';

const { write } = require('fs');
const path = require('path');
const fs = require('fs').promises;

const storageConfig = require('./storageConfig.json');
const turtleDataFile = path.join(__dirname, storageConfig.turtleDataFile);


// START WRAPPER FUNCTION //

function turtleDataStorage() {
  
  const { messages } = require(path.join(__dirname, storageConfig.messages));

  // Reading from storage file
  async function readStorage() {
    try {
      const data = await fs.readFile(turtleDataFile, 'utf8');
      return JSON.parse(data);
    }
    catch(err) {
      return [];
    }
  }

  // Writing to storage file
  async function writeStorage(data) {
    try {
      await fs.writeFile(turtleDataFile, JSON.stringify(data), {encoding: 'utf-8', flag:'w'});
      return messages.WRITE_OK
    }
    catch(err) {
      return messages.WRITE_ERROR(err.message)
    }
  }

  // Getting data from storage file
  async function getFromStorage(number) {
    return (await readStorage()).find(turtle => turtle.number == number) || null;
  }

  // Adding data to the storage file
  async function addToStorage(newTurtle) {
    const storage = await readStorage();
    if(storage.find(turtle => turtle.number == newTurtle.number)) {
      return false;
    }
    else {
      storage.push({
        number: +newTurtle.number,
        name: newTurtle.name,
        age: newTurtle.age,
        speed: newTurtle.speed,
        weightKg: newTurtle.weightKg
      });
      await writeStorage(storage);
      return true;
    }
  }

  // START CLASS //

  class turtleStorage {

    get messages() {
      return messages;
    }

    // Get all turtles
    getAll() {
      return readStorage();
    }

    // Get turtle by number
    get(number) {
      return new Promise(async (resolve, reject) => {
        if(!number) {
          reject(messages.NOT_FOUND());
        }
        else {
          const result = await getFromStorage(number);
          if(result) {
            resolve(result);
          }
          else {
            reject(messages.NOT_FOUND(number));
          }
        }
      })
    }

    // Insert new turtle to the storage
    insert(turtle) {
      return new Promise(async (resolve, reject) => )
    }
    
  }
  return new turtleStorage();

  // END CLASS //
}


// END WRAPPER FUNCTION //

module.exports = { turtleDataStorage }