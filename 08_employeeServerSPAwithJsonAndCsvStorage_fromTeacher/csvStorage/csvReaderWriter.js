// Reading and writing for CSV

'use strict';

const path = require('path');
const fs=require('fs');
const readline = require('readline');

// Reading and Writing start

async function readStorage(storageFile){
		const linereader=readline.createInterface({
			input: fs.createReadStream(storageFile)
		});
		const lines=[];
		try{
				for await (const line of linereader) {
					lines.push(line);
				}
				const data=[];
				for(let line of lines){
					data.push(line.split('","').map(d=>d.replace(/["]/g,'')));
				}
			// console.log(data);
				return csvToJson(data);
		}
		catch(err) {
				return [];
		}
}

async function writeStorage(storageFile, data){
	try{
		await fs.promises.writeFile(storageFile, createCsv(data), {encoding:'utf8', flag:'w'});
		return MESSAGES.WRITE_OK();

	}
	catch(err) {
		return MESSAGES.WRITE_ERROR(err.message);
	}
}
// Reading and Wrting end

// Internal helper functions, are not exported!

function createCsv(jsondata) {
		let csvString='';
		if(jsondata.length > 0) {
			csvString0='"'+Object.keys(jsondata[0]).join('","')+'"\n';
			for(let employee of jsondata) {
				csvString+='"'+Object.values(employee).join('","')+'"\n';
			}
		}
		return csvString;
}

function csvToJson(data){
	const [headers, ...datalines]=data;
	const jsonData=[];
	for(let employeeLine of datalines) {
		if(employeeLine.length === headers.length) {
			const employee = {};
			for (let i = 0; i < headers.length; i++) {
				employee[headers[i]] = employeeLine[i];
			}
			jsonData.push(employee);
		}
	}
	return jsonData;
}

// End helper functions

	
module.exports = {
    readStorage, writeStorage
}