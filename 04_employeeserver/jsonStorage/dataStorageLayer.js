'use strict';

const path = require('path');
const fs = require('fs').promises;

const storageConfig = require('./storageConfig.json');
const storageFile = path.join(__dirname, storageConfig.storageFile);

// Wrapper function  START //
function createDataStorage() {
  const { CODES, MESSAGES } = require(path.join(__dirname, storageConfig.errorCodes));

  // Private API functions //

  // reading storage file
  async function readStorage() {
    try {
      const data = await fs.readFile(storageFile, 'utf8');
      return JSON.parse(data);
    }
    catch(err) {
      return [];
    }
  }
  // writing to storage
  async function writeStorage(data) {
    //here code for writing 
  }

  // getting from storage with id (find returns first matching element from array. need to wait first for the storage to be read, otherwise --> "undefined")
  async function getFromStorage(id) {
    return (await readStorage()).find(employee => employee.employeeId == id) || null;
  }

  // more to come

  // Class START
  class DataStorage {
    get CODES() {
      return CODES;
    }

    getAll() {
      return readStorage();
    }

    get(id) {
      return new Promise(async resolve => {
        if(!id) {
          resolve(MESSAGES.NOT_FOUND('<empty id>'));
        }
        else {
          const result = await getFromStorage(id);
          if(result) {
            resolve(result);
          }
          else {
            resolve(MESSAGES.NOT_FOUND(id));
          }
        }
      });
    }

  } // Class END
  return new DataStorage();

} // Wrapper END

module.exports = {
  createDataStorage
}
