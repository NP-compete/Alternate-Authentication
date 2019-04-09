var isConnected = false;
var username, key1, key2, tag, passwordsString;


 chrome.extension.onConnect.addListener(function(port) {

      port.onMessage.addListener(function(msg) {
           console.log("message recieved: " + msg.type);

           if(msg.type == "isConnected"){
           		if(isConnected){port.postMessage({type: "connected", username: username, key1 :key1, key2: key2});} 
           		else {port.postMessage({type: "notConnected"});}

           }

           if(msg.type == "disconnected"){
           	isConnected = false;
           }
           if(msg.type == "login"){
           		isConnected = true;
           		username = msg.username;
           		key1 = msg.key1;
           		key2 = msg.key2;
           }

           if(msg.type == "checkTagOnLoad"){
           	  if(tag=='') return;
              if(!isTagOk(tag, passwordsString)){
               port.postMessage({type: "tagNotOk", username:username});
             }

           }

           if(msg.type == "checkTag"){
            getPasswordsAndTag(function(response){

              response = JSON.parse(response);
               tag = response.tag;
               passwordsString = response.passwords;
              if(tag=='') return;
              if(!isTagOk(tag, passwordsString)){
               alert("WARNING!!!\nYour passwords might have been compromised.\nPlease contact us immediatly!");
               port.postMessage({type: "tagNotOk"});
             }

            })
          }

      });
 })

function getPasswordsAndTag(callback){
  var xhr = new XMLHttpRequest();
  xhr.open('POST', "http://127.0.0.1:8081/", true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  var req = 'type=getPasswordsAndTag&user='+username;
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

function isTagOk(tag, passwordsString){
  //generating the new tag from the given passwords string
  //console.log(passwordsString);
  var hmac = new sjcl.misc.hmac(key2, sjcl.hash.sha256);
  var newTag = hmac.mac(passwordsString);

  tag = tag.split(",");
  console.log("tag is = "+tag);
  console.log("new tag is = "+newTag);
  newTag = sjcl.codec.base64.fromBits(newTag);
  tag = sjcl.codec.base64.fromBits(tag);

  console.log("tag is = "+tag);
  console.log("new tag is = "+newTag);
  //compare the tags
  if (tag == newTag){
    return true;
  }
  else{
    return false;
  }

}