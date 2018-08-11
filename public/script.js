
// Call functions that need to act on page load
if(document.readyState === "loading"){
	document.addEventListener("DOMContentLoaded", loadPage);
}else{
	loadPage();
}

function deleteTable(){
	var table = document.getElementById("mainTable");
	if(table){
		table.parentNode.removeChild(table);
	}
}

// Draw the table
function drawTable(rows){
	deleteTable();
	var header = ["Name", "Reps", "Weight", "Date", "Unit"];
	var table = document.createElement("table");
	table.id = "mainTable";
	// create the header
	var headerData = document.createElement("tr")
	for(var i = 0; i < header.length; i++){
		var cellData = document.createElement("th");
		cellData.textContent = header[i];
		headerData.appendChild(cellData);
	}
	table.appendChild(headerData);
		
	// create the other rows
	for(var i = 0; i < rows.length; i++){
		// Make the delete and edit  form buttons
		var formToAdd = document.createElement("FORM");
		var deleteButton = document.createElement("input");
		deleteButton.type = "submit";
		deleteButton.className = "delete";
		deleteButton.value = "Delete";
		var editButton = document.createElement("input");
		editButton.type = "submit";
		editButton.className = "edit";
		editButton.value = "Edit";
		var hiddenInput = document.createElement("input");
		hiddenInput.type = "hidden";
		hiddenInput.value = "";
		
		// Get the row data
		var rowData = document.createElement("tr")
		for(r in rows[i]){
			if(r + "" != "id"){
				var cellData = document.createElement("td");
				cellData.textContent = rows[i][r + ""];
				rowData.appendChild(cellData);
			}else{
				// get id
				hiddenInput.value = rows[i][r + ""];
			}
		}
		// add the row with the form
		formToAdd.appendChild(hiddenInput);
		formToAdd.appendChild(deleteButton);
		formToAdd.appendChild(editButton);
		var formCell = document.createElement("td");
		formCell.appendChild(formToAdd);
		rowData.appendChild(formCell);
		table.appendChild(rowData);
	}
	document.body.appendChild(table);
	
	// Add the onclick listeners to the submit buttons
	addSubButtonListeners();
}

// Load table on first page load
function loadPage(){
	var req = new XMLHttpRequest();
	req.open("GET", "/start-up");
	req.setRequestHeader("Content-Type", "application/json");
	req.addEventListener("load", function(){
		if(req.status >= 200 && req.status < 400){
			var response = JSON.parse(req.responseText)
			drawTable(response);
		}else{
			console.log("Error in network request: " + req.statusText);
		}
	});
	req.send();
}

// Call the functions to add event listeners to all buttons on the page
function addSubButtonListeners(){
	// Add click events to delete buttons
	var deleteSubButtons = document.getElementsByClassName("delete");
	for(var i = 0; i < deleteSubButtons.length; i++){
		deleteSubButtons[i].addEventListener("click", actDeleteButton);
	}
	
	// Add click events to edit buttons
	var editSubButtons = document.getElementsByClassName("edit");
	for (var i = 0; i < editSubButtons.length; i++) {
		editSubButtons[i].addEventListener("click", actEditButton);
	}
	
	// Add click events to input buttons
	var inputSubButtons = document.getElementsByClassName("input");
	for (var i = 0; i < inputSubButtons.length; i++) {
		inputSubButtons[i].addEventListener("click", actInputButton);
	}
}

// Delete the row of the table in MySQL and reload the table
function actDeleteButton(event){
	var req = new XMLHttpRequest();
	var id = this.previousElementSibling.value;
	var payload = {"id":"" + id};
	req.open("POST", "/delete-row", true);
	req.setRequestHeader("Content-Type", "application/json");
	req.addEventListener("load", function(){
		if(req.status >= 200 && req.status < 400){
			var response = JSON.parse(req.responseText)
			drawTable(response);
		}else{
			console.log("Error in network request: " + req.statusText);
		}
	});
	req.send(JSON.stringify(payload));
	event.preventDefault();
	
}

// Edit the row of the table in MySQL and reload the table
function actEditButton(event){
	var req = new XMLHttpRequest();
	console.log("It works TWICE");
	event.preventDefault();
	
}

function actInputButton(event){
	var req = new XMLHttpRequest();
	var payload = {name: null, reps: null, weight: null, date: null, unit: null};
	payload.name = document.getElementById("exeName").value || null;
	payload.reps = document.getElementById("exeReps").value || null;
	payload.weight = document.getElementById("exeWeight").value || null;
	payload.date = document.getElementById("exeDate").value || null;
	payload.unit = document.getElementById("exeUnit").value || null;
	
	document.getElementById("exeName").value = null;
	document.getElementById("exeReps").value = null;
	document.getElementById("exeWeight").value = null;
	document.getElementById("exeDate").value = null;
	document.getElementById("exeUnit").value = null;
	
	if(payload.name == null){
		alert("Inputting requires a name");
		event.preventDefault();
		return;
	}
	
	req.open("POST", "/input-row");
	req.addEventListener("load", function(){
		if(req.status >= 200 && req.status < 400){
			var response = JSON.parse(req.responseText)
			drawTable(response);
		}else{
			console.log("Error in network request: " + req.statusText);
		}
	});
	req.send(JSON.stringify(payload));
	event.preventDefault();
	
}

