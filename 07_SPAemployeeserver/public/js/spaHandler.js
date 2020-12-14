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
    document.getElementById('methods').addEventListener('change', choose);

    clearSelections();
  }

  function clearSelections() {
    // clearing function  

  }

  function choose(e) {
    // Clear selections
    messagearea.textContent = '';
    listarea.innerHTML = '';
    clearFieldValues();

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

  async function send() {
    let options = {
      headers: {'Content-Type': 'application/json'}
    }

    switch(method) {
      case 'ADD':
      case 'UPDATE':
        options.body = JSON.stringify(getFieldValues());
        options.method = 'POST';
      break;
      case 'GET':
      case 'REMOVE':
        options.body = JSON.stringify({personID: fields.personId.value});
        options.method = 'POST';
      break;
      default:
        options.method = 'GET';
    }
    // for testing:
    // console.log('options', options)
    // console.log('route', routes[method]);

    try {
      const result = await fetch(routes[method], options);
      // result transformed to json
      const data = await result.json();
      // messagearea.textContent = JSON.stringify(data, null, 4);      
      if(method === 'GETALL') {
        showAll(data);
      }
      else if (['ADD', 'UPDATE', 'REMOVE'].includes(method)) {
        showMessage(data);
      }
      else {
        updateFormData(data);
      }
    }
    catch(error) {
      console.log('Error:' +error.message);
    }
  }
  // End of the send

  function getFieldValues() {
    const values = {};
     // goes through fields and their values. get field values into object, stringify and put in body
    for(let field of Object.keys(fields)) {
      values[field] = fields[field].value;
    }
    return values;
  }  

  // Could be also "function showAll(data)""
  function showAll(persons) { 
    let htmlString = '<ul>';
    for(let person of persons) {
      htmlString += `<li>${person.personId}: ${person.firstname} ${person.lastname}, dept: ${person.department}, salary: ${person.salary}</li>`
    }
    listarea.innerHTML = htmlString+'<ul>';
  }

  function showMessage(data) {
    messagearea.innerHTML = `<p class="${data.type}">${data.message}</p>`;
  }

  function updateFormData(person) {
    // Clearing the message area
    messagearea.textContent = ''; 
    if(person.message) {
      showMessage(person);
    }
    else {
      for(let field of Object.keys(fields)) {
        fields[field].value = person[field];
      }
    }
  }

  // For clearing the form
  function clearFieldValues() {
    for(let field of Object.keys(fields)) {
      fields[field].value = '';
    }
  }

}) ();