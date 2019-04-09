
var port = chrome.extension.connect({
	name: "Sample Communication"
});

port.onMessage.addListener(function(msg) {
	//handling messages return from background
	console.log("message recieved: " + msg.type);
	if(msg.type == "notConnected"){
		$("#notConnected").show();
		$("#connected").hide();
	}

	if(msg.type == "connected"){
		$("#connected").show();
		$("#notConnected").hide();
	}

});

function connect(){
	console.log("Abcd");
	var username = "testUser";
	var password = "key";

	/*
		sending the hashed passwords to the server
	 */
	var xhr = new XMLHttpRequest();
	xhr.open('POST', "http://127.0.0.1:8081/", true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	var req = 'type=login';
	xhr.send(req);

	xhr.onreadystatechange = processRequest;

	function processRequest(e) {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var response = xhr.responseText;
			console.log("Superman");

			if (response == "success"){
				console.log("Batman");
				document.getElementById("connectMessage").innerHTML = (("Connection succesful").bold()).fontcolor("green");
				port.postMessage({type: "login"});
				port.postMessage({type: "updateData"});
				disconnectedToConnected();
			}
		}
	}

}

function disconnectedToConnected(){
	$("#connected").show();
	$("#notConnected").hide();
}

function connectedToDisconnected(){
	$("#connected").hide();
	$("#notConnected").show();
}

connect();
//checking if user is already connected
port.postMessage({type: "isConnected"});
