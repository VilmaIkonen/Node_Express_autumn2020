'use strict';

const path = require('path');

// Init function
function initLayerFunctions(baseDir, config){

	const storageFolder = path.join(baseDir, config.folder);
	const storageConfig = require(path.join(storageFolder, config.storageConfig));
	const storageFile = path.join(storageFolder, storageConfig.storageFile);
	const { readStorage, writeStorage } = require(path.join(storageFolder, storageConfig.readerWriter));

	async function getAllFromStorage() {
		return readStorage(storageFile);
	}

	async function getFromStorage(id) {
		return (await readStorage(storageFile)).find(employee =>employee.employeeId==id) || null;
	}

	async function addToStorage(newEmployee){
		const storage = await readStorage(storageFile);
		if(storage.find(employee=>employee.employeeId == newEmployee.employeeId)) {
				return false;
		}
		else {
			storage.push({
				employeeId: +newEmployee.employeeId,
				firstname: newEmployee.firstname,
				lastname:newEmployee.lastname,
				department: newEmployee.department,
				salary: +newEmployee.salary
			});
			await writeStorage(storageFile);
			return true;
		}
	} //end of addStorage

	async function removeFromStorage(id){
		let storage = await readStorage(storageFile);
		const i = storage.findIndex(employee=>employee.employeeId==id);
		if(i<0) return false;
		storage.splice(i,1);
		await writeStorage(storageFile);
		return true;
	}

	async function updateStorage(employee){
		let storage = await readStorage(storageFile);
		const oldEmployee = 
			storage.find(oldEmp => oldEmp.employeeId == employee.employeeId);
		if(oldEmployee) {
			Object.assign(oldEmployee, {
				employeeId: +employee.employeeId,
				firstname: employee.firstname,
				lastname: employee.lastname,
				department: employee.department,
				salary: +employee.salary 
			});
			await writeStorage(storageFile);
			return true;
		}
		else {
			return false;
		}
	}

	return { getAllFromStorage, getFromStorage, addToStorage, updateStorage, removeFromStorage };

} // Init end

module.exports = { initLayerFunctions }