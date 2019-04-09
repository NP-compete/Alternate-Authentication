
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
		$("#connectMessage").html("You are now connected with user: " + msg.username);
	}

});

//checking if user is already connected
port.postMessage({type: "isConnected"});

function connect(){
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
			
			if (response == "success"){
				document.getElementById("message").innerHTML = (("Connection succesful, you will be redirected in 3 second").bold()).fontcolor("green");
				port.postMessage({type: "login"});
				port.postMessage({type: "updateData"});
				setTimeout(disconnectedToConnected, 3000);
				$("#connectMessage").html("You are now connected with user: "+username);
			}	         		        
		}
	}

}

function disconnectedToConnected(){
	$("#login").fadeOut('slow', function () {$("#connected").fadeIn('slow')});

}

function connectedToDisconnected(){
	$("#connected").fadeOut('slow', function () {$("#login").fadeIn('slow')});

}




