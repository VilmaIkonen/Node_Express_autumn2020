'use strict';

(function() {
  const HIDE_SEARCH = false;
  const SHOW_SEARCH = true;
  const HIDE_FORM = false;
  const SHOW_FORM = true;


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
    // 1st clear everything
    toggleFieldsVisibility(HIDE_SEARCH, HIDE_FORM);
    clearListArea();
    clearMessageArea();
    clearFieldValues();
    
    method = 'GETALL';
    document.getElementById('getall').checked = true;
  }

  function choose(e) {
    // Clear selections
    clearMessageArea();
    clearListArea();    
    clearFieldValues();

    method = e.target.value;
    switch(method) {
      case 'GET':
      case 'REMOVE': toggleFieldsVisibility(SHOW_SEARCH, HIDE_FORM);
      break;
      case 'ADD':
      case 'UPDATE': toggleFieldsVisibility(SHOW_SEARCH, SHOW_FORM)
      break;
      default: toggleFieldsVisibility(HIDE_SEARCH, HIDE_FORM);
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
    // at start, both form and searchare hidden
    toggleFieldsVisibility(HIDE_SEARCH, HIDE_FORM);
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
    clearMessageArea();   
    if(person.message) {
      showMessage(person);
    }
    else {
      for(let field of Object.keys(fields)) {
        fields[field].value = person[field];
      }
      toggleFieldsVisibility(SHOW_SEARCH, SHOW_FORM);
    }
  }

  // For clearing the form
  function clearFieldValues() {
    for(let field of Object.keys(fields)) {
      fields[field].value = '';
    }
  }

   // For clearing the message area
  function clearMessageArea() {
    clearMessageArea();
  }

   // For clearing the list area
  function clearListArea() {
    listarea.innerHTML = '';
  }

  // Toggling between form and search field visibilityW
  function toggleFieldsVisibility(searchVisible = SHOW, formVisible = HIDE) {
    if(searchVisible) {
      search.removeAttribute('class')
    }
    else {
      search.setAttribute('class', 'hidden') // .hidden in css
    }
    if(formVisible) {
      form.removeAttribute('class')
    }
    else {
      form.setAttribute('class', 'hidden') 
    }
  }

}) ();