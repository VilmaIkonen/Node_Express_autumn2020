'use strict';

const path = require('path');
const fs=require('fs').promises;

const storageConfig=require('../jsonStorage/storageConfig.json');
const storageFile = path.join(__dirname, storageConfig.storageFile);

//wrapper function
function createDataStorage(){
    const {CODES,MESSAGES}=require(path.join(__dirname,storageConfig.errorCodes));

    //private API

    async function readStorage(){
        try{
            const data = await fs.readFile(storageFile,'utf8');
            return JSON.parse(data);
        }
        catch(err) {
            return [];
        }
    }

    async function writeStorage(data){
        try{
            await fs.writeFile(storageFile, JSON.stringify(data, null,4),{encoding:'utf8', flag:'w'});
            return MESSAGES.WRITE_OK();

        }
        catch(err) {
            return MESSAGES.WRITE_ERROR(err.message);
        }
    }

    async function getFromStorage(id) {
        return (await readStorage()).find(employee =>employee.employeeId==id) || null;
    }

    async function addToStorage(newEmployee){
        const storage = await readStorage();
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
            await writeStorage(storage);
            return true;
            //with checks
            //version 1:
            // return (await writeStorage(storage)).code===CODES.WRITE_OK; 
            //version 2:
            // const writeResult=await writeStorage(storage);
            // if(writeResult.code === CODES.WRITE_OK){
            //     return true
            // }
            // else {
            //     return false;
            // }
        }
    } //end of addStorage

    async function removeFromStorage(id){
        let storage = await readStorage();
        const i = storage.findIndex(employee=>employee.employeeId==id);
        if(i<0) return false;
        storage.splice(i,1);
        await writeStorage(storage);
        return true;
    }

    async function updateStorage(employee){
        let storage = await readStorage();
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
            await writeStorage(storage);
            return true;
        }
        else {
            return false;
        }
    }

    //more to come

    class Datastorage{
        get CODES() {
            return CODES;
        }

        getAll() {
            return readStorage();
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
            return new Promise( async (resolve, reject)=>{
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