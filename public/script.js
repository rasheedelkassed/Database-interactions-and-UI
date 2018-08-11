
// Call functions that need to act on page load
if(document.readyState === "loading"){
	document.addEventListener("DOMContentLoaded", addSubButtonListeners);
	document.addEventListener("DOMContentLoaded", loadTable);
}else{
	loadTable();
	addSubButtonListeners();
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
	// this loop is inefficient
	for(var i = 0; i < rows.length; i++){
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
		
		var rowData = document.createElement("tr")
		for(r in rows[i]){
			if(r + "" != "id"){
				var cellData = document.createElement("td");
				cellData.textContent = rows[i][r + ""];
				rowData.appendChild(cellData);
			}else{
				hiddenInput.value = rows[i][r + ""];
			}
		}
		formToAdd.appendChild(hiddenInput);
		formToAdd.appendChild(deleteButton);
		formToAdd.appendChild(editButton);
		var formCell = document.createElement("td");
		formCell.appendChild(formToAdd);
		rowData.appendChild(formCell);
		table.appendChild(rowData);
	}
	document.body.appendChild(table);
}

// Load table on first page load
function loadTable(){
	var req = new XMLHttpRequest();
	req.open("GET", "/start-up");
	req.setRequestHeader("Content-Type", "application/json");
	req.addEventListener("load", function(){
		if(req.status >= 200 && req.status < 400){
			var response = JSON.parse(req.responseText)
			drawTable(response);
		}else{
			console.log("Error in network request: " + request.statusText);
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
			console.log("Error in network request: " + request.statusText);
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

