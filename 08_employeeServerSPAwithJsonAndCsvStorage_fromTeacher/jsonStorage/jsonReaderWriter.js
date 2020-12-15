// Reading and Writing for JSON file

'use strict';

const path = require('path');
const fs=require('fs').promises;

async function readStorage(storageFile){
	try{
			const data = await fs.readFile(storageFile,'utf8');
			return JSON.parse(data);
	}
	catch(err) {
			return [];
	}
}

async function writeStorage(storageFile, data){
	try{
			await fs.writeFile(storageFile, JSON.stringify(data, null,4),{encoding:'utf8', flag:'w'});
			return MESSAGES.WRITE_OK();
	}
	catch(err) {
			return MESSAGES.WRITE_ERROR(err.message);
	}
}

module.exports = { readStorage, writeStorage }