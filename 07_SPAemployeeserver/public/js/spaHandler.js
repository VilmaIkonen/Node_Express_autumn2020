'use strict';

(function() {
  const HIDE = false;
  const SHOW = true;

  // elements we ahve access in the home.html
  let method = 'GETALL';
  let messagearea;
  let listarea;
  let search;
  let form;

  let fields = {
    personId: '', 
    fistname:'', 
    lastname: '', 
    department:'', 
    salary:''
  }

  // Routes for the server in indexSPAserver.js
  const routes = {
    GETALL: '/all',
    GET: '/getperson',
    ADD: '/insertperson',
    UPDATE: '/updateperson',
    REMOVE: '/removeperson'
  }

  document.addEventListener('DOMContentLoaded', init);

  // On webpage initialization //
  function init() {
    // takes only keys of the fields in the array
    for(let field of Object.keys(fields)) {
      fields[field] = document.getElementById(field)
    }
    search = document.getElementById('search');
    form = document.getElementById('form');
    listarea = document.getElementById('listarea');
    messagearea = document.getElementById('messagearea');

    // Handlers for the submit and radio buttons
    document.getElementById('submit').addEventListener('click', send);
    document.getElementById(methods).addEventListener('change', choose);

    clearSelections();
  }

  function clearSelections() {
    // clearing function here
  }

  function choose(e) {
    // clearSelections();
    method = e.target.value;
    switch(method) {
      case 'GET':
      case 'REMOVE': // code here
      break;
      case 'ADD':
      case 'UPDATE': // code here
      break;
      default: //code here
    }
     
  }

  function send() {
    // code here later
  }

  

}) ();