
// Call functions on page load
if(document.readyState === "loading"){
	document.addEventListener("DOMContentLoaded", addSubButtonListeners);
}else{
	
}

// Draw the table
function drawTable(rows){
	console.log(rows);
	var header = ["Name", "Reps", "Weight", "Date", "Unit"];
	var table = document.createElement("table");
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
		var rowData = document.createElement("tr")
		for(r in rows[i]){
			if(r != "id"){
				var cellData = document.createElement("td");
				cellData.textContent = rows[i+1][r];
				rowData.appendChild(cellData);
			}
		}
		table.appendChild(rowData);
	}
	document.body.appendChild(table);
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
			console.log(response);
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

