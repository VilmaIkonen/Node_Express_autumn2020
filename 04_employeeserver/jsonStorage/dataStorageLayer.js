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
  } // END of Storage function

  // Removing from storage
  async function removeFromStorage(id) {
    let storage = await readStorage();
    const i = storage.findIndex(employee => employee.employeeId == id);
    if(i < 0) return false;
    storage.splice(i, 1); // splice, takes value out from the array
    await writeStorage(storage);
    return true;
  }

   // Updating storage
   async function updateStorage(employee) {
     let storage = await readStorage();
     const oldEmployee = storage.find(oldEmp => oldEmp.employeeId == employee.employeeId);
     if(oldEmployee) {
       Object.assign(oldEmployee, {
         employeeId: +employee.employeeId,
         firstname: employee.firstname,
         lastname: employee.lastname,
         department: employee.department,
         salary: +employee.salary
       });
       await writeStorage(storage);
       return true;
     } 
     else {
      return false;
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

    remove(employeeId) {
      return new Promise(async (resolve, reject) => {
        if(!employeeId) {
          reject(MESSAGES.NOT_FOUND('<empty>'))
        }
        else {
          if(await removeFromStorage(employeeId)) {
            resolve(MESSAGES.REMOVE_OK(employeeId));
          }
          else {
            reject(MESSAGES.NOT_REMOVED());
          }
        }
      });
    }

    update(employee) {
      return new Promise(async (resolve, reject) => {
        if (!(employee && employee.employeeId && employee.firstname && employee.lastname)){
          reject(MESSAGES.NOT_UPDATED());
        }
        else {
          if(await updateStorage(employee)) {
            resolve(MESSAGES.UPDATE_OK(employee.employeeId));
          }
          else {
            reject(MESSAGES.NOT_UPDATED());
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
