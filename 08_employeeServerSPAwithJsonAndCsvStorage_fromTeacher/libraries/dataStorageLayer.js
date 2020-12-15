'use strict';

const path = require('path');

// Wrapper function
function createDataStorage(baseDir, config){

	const libPath = path.join(baseDir, config.storageLibraries.folder)
	const { CODES, MESSAGES }=require(path.join(libPath, config.storageLibraries.errorCodes));
	const { initLayerFunctions } = require(path.join(libPath, config.storageLibraries.layerFunctions));

	const { 
		getAllFromStorage, 
		getFromStorage, 
		addToStorage, 
		updateStorage, 
		removeFromStorage 
	} = initLayerFunctions (baseDir, config.storage);

	class Datastorage{
		get CODES() {
			return CODES;
		}

		getAll() {
			return getAllFromStorage();
		}

		get(id){
			return new Promise(async (resolve,reject) =>{
				if(!id) {
					reject(MESSAGES.NOT_FOUND('<empty id>'));
				}
				else {
					const result = await getFromStorage(id);
					if(result) {
							resolve(result);
					}
					else{
							reject(MESSAGES.NOT_FOUND(id));
					}
				}
			});
		}
		insert(employee){
				return new Promise(async (resolve,reject)=>{
						if(!(employee && employee.employeeId &&
									employee.firstname && employee.lastname)){
											reject(MESSAGES.NOT_INSERTED());
						}
						else{
								if( await addToStorage(employee)) {
										resolve(MESSAGES.INSERT_OK(employee.employeeId));
								}
								else {
										reject(MESSAGES.ALREADY_IN_USE(employee.employeeId));
								}
						}
				});
		}

	remove(employeeId){
		return new Promise(async (resolve, reject)=>{
			if(!employeeId) {
				reject(MESSAGES.NOT_FOUND('<empty>'));
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
		return new Promise( async (resolve, reject)=> {
			if(!(employee && employee.employeeId &&
						employee.firstname && employee.lastname)){
								reject(MESSAGES.NOT_UPDATED());
			}
			else {
					if(await updateStorage(employee)){
							resolve(MESSAGES.UPDATE_OK(employee.employeeId));
					}
					else {
							reject(MESSAGES.NOT_UPDATED());
					}
				}
			});
		}

	} // class end

	return new Datastorage();

} //wrapper end

module.exports = {
    createDataStorage
}