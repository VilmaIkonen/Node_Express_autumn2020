// Data access layer for turtle data //

'use strict';

const path = require('path');
const fs = require('fs').promises;

const storageConfig = require('./storageConfig.json');
const turtleDataFile = path.join(__dirname, storageConfig.turtleDataFile);


// START WRAPPER FUNCTION //

function turtleDataStorage() {
  
  const { messages } = require(path.join(__dirname, storageConfig.messages));

  async function readStorage() {
    try {
      const data = await fs.readFile(turtleDataFile, 'utf8');
      return JSON.parse(data);
    }
    catch(err) {
      return [];
    }
  }

  // START CLASS //

  class turtleStorage {

    getAll() {
      return readStorage();
    }
    
  }
  return new turtleStorage();

  // END CLASS //
}


// END WRAPPER FUNCTION //

module.exports = { turtleDataStorage }