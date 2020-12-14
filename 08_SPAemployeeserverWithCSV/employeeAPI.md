# Employee data storage

## employee.json
The employee id is unique.

```json
[
  {
    "employeeId": 1,
    "firstname": "Leila",
    "lastname": "Hökki",
    "department": "ict",
    "salary": 4000
  },
  {
    "employeeId": 2,
    "firstname": "Matt",
    "lastname": "River",
    "department": "ict",
    "salary": 4000
  }
]
```

## storageConfig.json

```json
{
  "storageFile": "employees.json",
  "errorCodes": "errorCodes.js"
}
```

The implementation is wrapped in a createDataStorage function. Function returns Datastorage object.

### Public API (methods of Datastorage class)

- getAll()
  - returns an array of all employees / empty array []
  
- get(id)
  - returns an employee object / NOT_FOUND

- insert(newEmployee)
  - returns INSERT_OK / NOT_INSERTED / ALLREADY_IN_USE
  
- update(updatedEmployee)
  - returns UPDATE_OK / NOT_UPDATED 

- remove(id)
  - returns REMOVE_OK / NOT_FOUND / NOT_REMOVED

- getter for error codes
  - returns an array of error codes
  


### Private API (can be used only inside wrapper function)

Handle writing to and reading from the disk:

- readStorage()
  - returns an array of employees / empty array []
  - read will always be done before executing any other functions

- writeStorage()
  -   returns WRITE_OK / WRITE_ERROR
  
- getFromStorage(id)
  - returns an employee object / null

- addToStorage(newEmployee) 
  - returns true / false

- updateStorage(updatedEmployee)
  - returns true / false

- removeFromStorage(id)
  - returns true / false

### Error codes

```js
const CODES = {
  PROGRAM_ERROR: 0, 
  NOT_FOUND: 1,
  INSERT_OK: 2
  ...
}
```
The format of an error message is:
```js
const MESSAGES = {
  PROGRAM_ERROR: () => ({
    message: 'Sorry! Error in the programme.',
    code: CODES.PROGRAM_ERROR,
    type: 'error'
  }), 
  NOT_FOUND: id => ({
    message:`No employee found with employeeId`,
    code: CODES.NOT_FOUND,
    type: 'error'
  }),
  INSERT_OK: id => ({
    message: `Employee ${id} was inserted`,
    code: CODES.INSERT_OK,
    type:'info'
  })
}
```
Error types are either `error` or `info`.
