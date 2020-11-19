'use strict';

const path = require('path');
const fs = require('fs').promises;

const storageConfig = require('./storageConfig.json');
const storageFile = path.join(__dirname, storageConfig.storageFile);

//  ----- Wrapper function  START (Creates the data storage) ----- //
function createDataStorage() {
  const { CODES, MESSAGES } = require(path.join(__dirname, storageConfig.errorCodes));

  // Private API functions (not shown outside this module) //

  // Reading storage file. `async` function because reading is done as 'promises'. With async, one can use `await` or `then / catch`
  async function readStorage() {
    try {
      const data = await fs.readFile(storageFile, 'utf8');
      return JSON.parse(data);
    }
    catch(err) {
      return [];
    }
  }
  // Writing to storage
  async function writeStorage(data) {
    //here code for writing 
  }

  // Getting data from storage with id (find returns first matching element from array. need to wait first for the storage to be read, otherwise --> "undefined")
  async function getFromStorage(id) {
    return (await readStorage()).find(employee => employee.employeeId == id) || null;
  }

  // more to come

  // ----- Class START ----- (public API, will be shown outside of this module) //
  class DataStorage {
    get CODES() {
      return CODES;
    }

    getAll() {
      return readStorage();
    }

    get(id) {
      return new Promise(async (resolve, reject) => {
        if(!id) {
          reject(MESSAGES.NOT_FOUND('<empty id>'));
        }
        else {
          const result = await getFromStorage(id);
          if(result) {
            resolve(result);
          }
          else {
            reject(MESSAGES.NOT_FOUND(id));
          }
        }
      });
    }

  } 
  // ----- Class END ----- //

  // return new object from DataStorage
  return new DataStorage();

} // ----- Wrapper END ----- //

// Export only wrapper function
module.exports = {
  createDataStorage
}
