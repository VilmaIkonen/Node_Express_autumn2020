// Data access layer for turtle data //

'use strict';

const { write } = require('fs');
const { resolve } = require('path');
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
      await fs.writeFile(turtleDataFile, JSON.stringify(data, null, 4), {encoding: 'utf-8', flag:'w'});
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

  // Removing turtle data from the storage
  async function removeFromStorage(number) {
    let storage = await readStorage();
    const turtleIndex = storage.findIndex(turtle => turtle.number == number);
    if(turtleIndex <0) return false;
    storage.splice(turtleIndex, 1); // take 1 turtle from array
    await writeStorage(storage);
    return true;
  }

  // Updating storage data
  async function updateStorage(turtle) {
    let storage = await readStorage();
    const turtleToUpdate = storage.find(oldTurtle => oldTurtle.number == turtle.number);
    if(turtleToUpdate) {
      Object.assign(turtleToUpdate, {
        number: +turtle.number,
        name: turtle.name,
        age: +turtle.age,
        speed: turtle.speed,
        weightKg: +turtle.weightKg
      });
      await writeStorage(storage);
      return true;
    }
    else {
      return false;
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
      return new Promise(async (resolve, reject) => {
        if(!turtle && turtle.number && turtle.name){
          reject(messages.NOT_INSERTED());
        }
        else {
          if(await addToStorage(turtle)) {
            resolve(messages.INSERT_OK(turtle.number));
          }
          else {
            reject(messages.ALREADY_IN_USE(turtle.number));
          }
        }

      })
    }

    // Remove turtle from storage based on number
    remove(number) {
      return new Promise(async (resolve, reject) => {
        if(!number) {
          reject(messages.NOT_FOUND())
        }
        else {
          if(await removeFromStorage(number)) {
            resolve(messages.REMOVE_OK(number));
          }
          else {
            reject(messages.NOT_REMOVED());
          }
        }
      });
    }
    
    // Update turtle data 
    update(turtle) {
      return new Promise(async (resolve, reject) => {
        if(!(turtle && turtle.number && turtle.name)) {
          reject(messages.NOT_UPDATED());
        }
        else {
          if(await updateStorage(turtle)) {
            resolve(messages.UPDATE_OK(turtle.number));
          }
          else {
            reject(messages.NOT_UPDATED());
          }
        }
      })
    }
  }

  return new turtleStorage();

  // END CLASS //
}


// END WRAPPER FUNCTION //

module.exports = { turtleDataStorage }