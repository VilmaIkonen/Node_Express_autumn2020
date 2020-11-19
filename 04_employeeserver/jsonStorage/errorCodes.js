'use strict';

const CODES = {
  PROGRAM_ERROR: 0, 
  NOT_FOUND: 1,
  INSERT_OK: 2,
  NOT_INSERTED: 3,
  ALREADY_IN_USE: 4,
  REMOVE_OK: 5,
  NOT_REMOVED: 6,
  UPDATE_OK: 7,
  NOT_UPDATED: 8,
  WRITE_OK: 9,
  WRITE_ERROR: 10
}

const MESSAGES = {
  PROGRAM_ERROR: () => ({
    message: 'Sorry! Error in the program.',
    code: CODES.PROGRAM_ERROR,
    type: 'error'
  }),
  NOT_FOUND: id => ({
    message:`No employee found with employeeId ${id}`,
    code: CODES.NOT_FOUND,
    type: 'error'
  }),
  INSERT_OK: id => ({
    message: `Employee ${id} was inserted`,
    code: CODES.INSERT_OK,
    type:'info'
  })
}
// () Parenthesis needed (unless `return` is used)

// Program errors could be also put under one function and `map` the array

module.exports = { CODES, MESSAGES }