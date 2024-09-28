import { data } from './data.js';

const table = document.querySelector('#table'); 

//Function to generate the table from data - Json object array
function generateTable(data) {
    const headerRow = document.createElement('tr'); // Creating table header row
    const checkmarkHeader = document.createElement('th');
    checkmarkHeader.innerHTML = '<i class="fa-solid fa-check"></i>';
    checkmarkHeader.classList.add('checkmark');
    headerRow.appendChild(checkmarkHeader); 
    const headers = Object.keys(data[0]); // Storing keys of 1st element of data
    headers.forEach((header,index) => {
        const th = document.createElement('th');
        th.textContent = header;
        th.addEventListener('click', (e) => {   
            sortTable(data, header, index);
        }); //Adding click event listener on each header to sort that column
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Creating table rows for each object in JSON data
    data.forEach((item,index) => {
        const row = document.createElement('tr');
        const checkmarkCell = document.createElement('td');
        checkmarkCell.innerHTML = '<i class="fa-solid fa-check"></i>';
        checkmarkCell.classList.add('checkmark');
        row.appendChild(checkmarkCell);
        headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = item[header]; // Inserting data into each cell
            td.setAttribute('name', header);
            td.setAttribute('index', index+1);
            td.addEventListener('dblclick', (e) => editCell(e, header, index));  //Adding double click event listener for each cell for edit functionality
            row.appendChild(td);
        });
        row.addEventListener('click', () => highlighRow(row,index+1)); // adding click event listener on each row for highlight functoinality
        table.appendChild(row);
    });
};

// Function to sort the table
let sortOrder = {}; // Object to keep track of the sort order for each column
function sortTable(data, column, index) {
    // Initialize sortOrder for the column if not already done
    if (!sortOrder[column]) {
        sortOrder[column] = 'ascending';
    }
    sortOrder[column] = sortOrder[column] === 'ascending' ? 'descending' : 'ascending';
    data.sort((a, b) => {
        const valA = a[column];
        const valB = b[column];

        if (typeof valA === 'number') {
            return sortOrder[column] === 'ascending' ? valA - valB : valB - valA;
        } else {
            return sortOrder[column] === 'ascending' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
    });
    table.innerHTML='';
    generateTable(data); //Re-generating table with modified data
    }

//Function to highlight the row when selected
let highlightedRowIndex = -1; //To keep track to highlighted row
let prevSelectedRow = null; // To keep track of selected row to de-select
function highlighRow(row, index){
    if (prevSelectedRow){
        prevSelectedRow.classList.remove("selected");
    }
    highlightedRowIndex = index;
    row.classList.add("selected");  //Adding class for style changes
    prevSelectedRow = row;
    up.disabled = (highlightedRowIndex === 1) ? true : false; // Disabling up arrow when first row is highlighed
    down.disabled = (highlightedRowIndex === (document.querySelectorAll("#table tr").length-1)) ? true : false; // Disabling down arrow when last row is highlighed
};


//Function to edit the contents of multiple cells of same row
let editHeaders = {}; //To keep track to updated value of all the headers
let editIndex = -1; //To keep track of the row number
function editCell(e, nameValue, rowIndex){
    const prevValue = e.target.textContent;
    editIndex = rowIndex;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = prevValue; //Utitlying input element of type text
                   
    e.target.innerHTML = '';
    e.target.appendChild(input); 
    input.focus();
    
    input.addEventListener('blur', () => {
        e.target.innerHTML = input.value; // Set the value back to the cell on blur
        e.target.classList.remove('selected'); 
    });
    
    input.addEventListener('input', () => {
        editHeaders[nameValue] = input.value; // Store the updated value for this header in data variable
    });
};

//Button functionalities

//To navigate up the table 
document.getElementById('up').addEventListener('click', () => {
    if (highlightedRowIndex>=1)
    {
        highlightedRowIndex--;
        const currentRow = document.querySelectorAll("#table tr")[highlightedRowIndex];
        highlighRow(currentRow, highlightedRowIndex);    
    }
}); 

//To navigate down the table                     
document.getElementById('down').addEventListener('click', () => {
    const totalRows = document.querySelectorAll("#table tr").length;
    if (highlightedRowIndex<(totalRows))
    {   
        highlightedRowIndex++;
        const currentRow2 = document.querySelectorAll("#table tr")[highlightedRowIndex];
        highlighRow(currentRow2, highlightedRowIndex);    
    }
});

//To reset the table to the original form
document.getElementById('reset').addEventListener('click', () => {
    sortOrder["id"] = "decending"
    sortTable(data, "id", 1); 
    sortOrder = {};  
});

//to delete a selected row            
document.getElementById('delete').addEventListener('click', () => {
    if (highlightedRowIndex>=0) {
        data.splice(highlightedRowIndex, 1);
        table.innerHTML = '';
        generateTable(data);
    }
});

//To save changes after editing single/multiple cell of same row
document.getElementById('save').addEventListener('click', () => {
    if (Object.keys(editHeaders).length > 0 && editIndex >= 0)
    {
        Object.keys(editHeaders).forEach(header => {
            data[editIndex][header] = editHeaders[header];
        });
        table.innerHTML='';
        generateTable(data);
        editHeaders={};
        editIndex=-1;
    }   
});

//To add a new row at the end of the table; user should double click on each cell for adding new values
document.getElementById('add').addEventListener('click', () => {
    data.push({ "ID": '', "Chemical name": '', "Vendor": '', "Density": '', "Viscosity": '', "Packaging": '', "Pack size": '', "Unit": '', "Quantity": '' });
    table.innerHTML='';
    generateTable(data);   
} );

// Generate the table when the script runs
generateTable(data);

                              