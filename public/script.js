
// Call functions on page load
if(document.readyState === "loading"){
	document.addEventListener("DOMContentLoaded", addSubButtonListeners);
}else{
	
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
	var payload = {"id":id};
	req.open("POST", "/delete-row", true);
	req.setRequestHeader("Content-Type", "application/json");
	req.addEventListener("load", function(){
		if((req.status >= 200 && req.status < 400){
			var response = JSON.parse(req.responseText);
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