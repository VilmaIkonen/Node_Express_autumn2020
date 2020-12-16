'use strict';

(function () {
    const HIDE_SEARCH=false;
    const SHOW_SEARCH=true;
    const HIDE_FORM = false;
    const SHOW_FORM = true;

    let method='GETALL';
    let messagearea;
    let listarea;
    let search;
    let form;

    let fields={
        personId:'', firstname:'', lastname:'', department:'', salary:''
    }
    const routes={
        GETALL:'/all',
        GET:'/getperson',
        ADD:'/insertperson',
        UPDATE:'/updateperson',
        REMOVE:'/removeperson'
    }
    
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        for(let field of Object.keys(fields)){
            fields[field]=document.getElementById(field);
        }
        // console.log(fields);
        search=document.getElementById('search');
        form=document.getElementById('form');
        listarea=document.getElementById('listarea');
        messagearea=document.getElementById('messagearea');

        document.getElementById('submit').addEventListener('click', send);
        document.getElementById('methods').addEventListener('change', choose);

        clearSelections();
    }

    function clearSelections() {
        toggleFieldsVisibility(HIDE_SEARCH, HIDE_FORM);
        clearMessageArea();
        clearListArea();
        clearFieldValues();
        method='GETALL';
        document.getElementById('getall').checked=true; 
    }

    function choose(e) {
        clearMessageArea();
        clearListArea();
        clearFieldValues();
        method=e.target.value;
        // console.log(method);
        switch(method) {
            case 'GET':
            case 'REMOVE':toggleFieldsVisibility(SHOW_SEARCH, HIDE_FORM);
            break;
            case 'ADD':
            case 'UPDATE': toggleFieldsVisibility(SHOW_SEARCH, SHOW_FORM);
                break;
            default:
                toggleFieldsVisibility(HIDE_SEARCH, HIDE_FORM);
        }
    }

    async function send() {
        let options={
            headers:{'Content-Type':'application/json'}
        }

        switch(method) {
            case 'ADD':
            case 'UPDATE':
                options.body = JSON.stringify(getFieldValues());
                options.method='POST';
            break;
            case 'GET':
            case 'REMOVE':
                options.body = JSON.stringify({personId: fields.personId.value});
                options.method='POST';
            break;
            default: 
                options.method='GET';
        }

        // console.log('options',options);
        // console.log('route',routes[method]);

        try{
            const result=await fetch(routes[method],options);
            const data = await result.json();
            if(method==='GETALL') {
                showAll(data);
            }
            else if (['ADD','UPDATE','REMOVE'].includes(method)) {
                showMessage(data);
            }
            else{
                updateFormData(data);
            }
            
        }
        catch(error){
            console.log('Error:'+error.message);
        }
    } //end of the send

    function getFieldValues(){
        const values={};
        for(let field of Object.keys(fields)){
            values[field]=fields[field].value;
        }
        return values;
    }

    function showAll(persons) {
        toggleFieldsVisibility(HIDE_SEARCH, HIDE_FORM);
        let htmlString='<ul>';
        for(let person of persons) {
            htmlString+=`<li>${person.personId}: ${person.firstname} ${person.lastname}, `+
            `dept:${person.department}, salary: ${person.salary}</li>`;
        }
        listarea.innerHTML=htmlString+'</ul>';
    }

    function showMessage(data) {
        messagearea.innerHTML=`<p class="${data.type}">${data.message}</p>`;
    }

    function updateFormData(person) {
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

    function clearFieldValues() {
        for(let field of Object.keys(fields)){
            fields[field].value='';
        }
    }

    function clearMessageArea(){
        messagearea.textContent = '';
    }

    function clearListArea() {
        listarea.innerHTML = '';
    }

    function toggleFieldsVisibility(searchVisible=SHOW, formVisible=HIDE) {
        if(searchVisible) {
            search.removeAttribute('class');
        }
        else {
            search.setAttribute('class','hidden');
        }

        if(formVisible) {
            form.removeAttribute('class');
        }
        else {
            form.setAttribute('class','hidden');
        }
    }


})();