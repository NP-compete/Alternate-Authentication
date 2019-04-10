var isConnected = false;
var passwordsString;


 chrome.extension.onConnect.addListener(function(port) {

      port.onMessage.addListener(function(msg) {
           console.log("message recieved: " + msg.type);

           if(msg.type == "isConnected"){
           		if(isConnected){port.postMessage({type: "connected"});}
           		else {port.postMessage({type: "notConnected"});}

           }

           if(msg.type == "disconnected"){
           	isConnected = false;
           }

           if(msg.type == "login"){
           	isConnected = true;
           }

           if(msg.type == "updateData"){
            getPasswords(function(response){
              response = JSON.parse(response);
              tag = response.tag;
              passwordsString = response.passwords;
            })
          }

      });
 })

function getPasswords(callback){
  var xhr = new XMLHttpRequest();
  xhr.open('POST', "http://127.0.0.1:8081/", true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  var req = 'type=getPasswords';
  xhr.send(req);
  xhr.onreadystatechange = processRequest;
  function processRequest(e) {

    if (xhr.readyState == 4 && xhr.status == 200) {
      var response = xhr.responseText;

      if(response == "failed"){
        console.log("get passwords string request failed")
      }
      if(response.length > 0){
        callback(response);
        return response;
      }
    }
  }
}
