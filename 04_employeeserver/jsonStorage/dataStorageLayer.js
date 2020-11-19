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
    try {
      await fs.writeFile(storageFile, JSON.stringify(data, null, 4), {encoding: 'utf8', flag:'w'}); // `flag: w` writes over the old version // `null` `4`: beautifying part only
      return MESSAGES.WRITE_OK();
    } 
    catch(err){
      return MESSAGES.WRITE_ERROR(err.message);
    }
  }

  // Getting data from storage with id (find returns first matching element from array. need to wait first for the storage to be read, otherwise --> "undefined")
  async function getFromStorage(id) {
    return (await readStorage()).find(employee => employee.employeeId == id) || null;
  }

  // Adding to storage
  async function addToStorage (newEmployee) {
    const storage = await readStorage();
    if(storage.find(employee => employee.employeeId == newEmployee.employeeId)) {
      return false;
    }
    else {
      storage.push({
        employeeId: +newEmployee.employeeId,
        firstname: newEmployee.firstname,
        lastname: newEmployee.lastname,
        department: newEmployee.department,
        salary: +newEmployee.salary
      });
      await writeStorage(storage); // check this in test.js what is the contents of `storage`
      return true;
      // const writeResult = await writeStorage(storage);
      // if(writeResult.code === CODES.WRITE_OK) {
      //   return true;
      // }
      // else {
      //   return false;
      // }
    }
  }

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
    insert(employee) {
      return new Promise(async (resolve, reject) => {
        // required fields to enter are id, firstname, lastname
        if(!(employee && employee.employeeId && employee.firstname && employee.lastname)) {
          reject(MESSAGES.NOT_INSERTED());
        }
        else {
          if(await addToStorage(employee)) {
            resolve(MESSAGES.INSERT_OK(employee.employeeId));
          }
          else {
            reject(MESSAGES.ALREADY_IN_USE(employee.employeeId));
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
module.exports = { createDataStorage }
