'use strict';

const messages = {
  PROGRAM_ERROR: () => ({
    message: 'Sorry! Error in the program.',
    type: 'error'
  }),
  NOT_FOUND: number => ({
    message:`No turtle found with number ${number}`,
    type: 'error'
  }),
  INSERT_OK: number => ({
    message: `Turtle number ${number} was inserted`,
    type:'info'
  }),
  NOT_INSERTED: () => ({
    message: `Turtle was not inserted`,
    type:'error'
  }),
  ALREADY_IN_USE: number => ({
    message: `Number ${number} is already in use`,
    type:'error'
  }),
  REMOVE_OK: number => ({
    message: `Turtle number ${number} was removed`,
    type:'info'
  }),
  NOT_REMOVED:() => ({
    message: `No turtle found with given number. Nothing removed.`,
    type:'error'
  }),
  UPDATE_OK: number => ({
    message: `Turtle number ${number} was updated`,
    type:'info'
  }),
  NOT_UPDATED: () => ({
    message: `Data was not updated`,
    type:'error'
  }),
  WRITE_OK: () => ({
    message: `Write OK`,
    type:'info'
  }),
  WRITE_ERROR: errormessage => ({
    message: errormessage,
    type:'error'
  }) 
}
// () Parenthesis needed (unless `return` is used)

// Program errors could be also put under one function and `map` the array

module.exports = { messages }