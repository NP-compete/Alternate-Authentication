/*
getting user informatinoi from background, stores it at local storage
 */
var key1 , key2 , username = null, hostname = window.location.hostname;

var port = chrome.extension.connect({
  name: "Sample Communication"
});

port.onMessage.addListener(function(msg) {
  //handling messages return from background
  console.log("message recieved: " + msg.type);
  if(msg.type == "connected"){
    username = msg.username;
    key1 = msg.key1;
    key2 = msg.key2;
    console.log(username+key1+key2);
    onLoad();
  }
});

//checking if user is already connected
port.postMessage({type: "isConnected"});



/*
running at document start
 */

function onLoad() {
  if(username != null){ //if connected
    console.log("user connected");
      getPasswordsAndTag(function(response) {
        response = JSON.parse(response);
        var tag = response.tag;
        var passwordsString = response.passwords;
            console.log("got pass from server: "+passwordsString);
        if(tag == "" || passwordsString == ""){ //if no passwords stored for this user
          console.log("no passwords for this user");
          return;
        }
        if(isTagOk(tag,passwordsString)){ //if tag is ok
          console.log("tag checked ok");
          if(isDocHasPassInput()){//if the doc has input fields
          	  console.log("doc has pass input");
	          //decrypting the passwords string
	          var decryptedPasswords = decryptPasswords(passwordsString,key1);
	          var jsonPasswords = JSON.parse(decryptedPasswords);
	          //checking if passwords exist for this specific hostname. return index of passwords or -1 if not exist.
	          var index = findIndexOfPassDetails(hostname, jsonPasswords);
	          if(index > -1){ 
	            console.log("found password for this hostname");
	           
	           		  fillFields(jsonPasswords[index]);
	         	 
	          }
	          else{
	            console.log("no passwords found for this hostname");
	          }
	      }
        }
        else { //tag is not ok, someone changed the passwords- notify the client!
          console.log("TAG WAS CHANGED");
          $('body').prepend('<div id="warning" align="center" style="padding: 20px; z-index: 99;  background-color: #f44336; color: white; margin-bottom: 15px;">WARNING!!! Your passwords might have been compromised! Contact us immediatly.</div>');
		  $("warning").css("padding: 20px, background-color: #f44336, color: white, margin-bottom: 15px");
		  //$("closebtn").css("    margin-left: 15px, color: white, font-weight: bold, float: right, font-size: 22px, line-height: 20px, cursor: pointer, transition: 0.3s");        
         // $("closebtn").hover($(this).css("color: black"));

        }
      });
  }
}


/*
update passwords in the database or adding them if not exist
 */
document.addEventListener("submit", function(){
  if(username ==null){
    return;
    }
  //gets input information
  var password = getPassword();
  var user = getUsername();
  var host = window.location.hostname;
  //retriving passwords from server
  getPasswordsAndTag(function(response) {
    var firstPassword = false;
    response = JSON.parse(response);
    var passwordsString = response.passwords;
    passwordsString = changePlus(passwordsString);
    if(passwordsString == ""){ //if first password
       var userAns = window.confirm("New password recognized. Do you wish to save it?");
       if (!userAns){
          return;    
       }
      firstPassInsert(host, user, password);
    }
    else{

      var jsonPasswords = JSON.parse(decryptPasswords(passwordsString,key1));
      var index = findIndexOfPassDetails(host, jsonPasswords);
      if (index == -1 ){ // if the password for hostname isn't exist in db
         var userAns = window.confirm("New password recognized. Do you wish to save it?");
         if (!userAns){
             return;
        }
        passInsert (jsonPasswords,host,user,password);
      }
      else{// password exist, and needs to update
        if (jsonPasswords[index].password != password || jsonPasswords[index].username != username ){
            var userAns = window.confirm("A password for this hostname already exist. Do you wish to update it?");
             if (!userAns){
             return;
            }
          passUpdate(index,jsonPasswords,user,password);
        }
        else{ //pass did not changed
                  console.log("password for this hostname didnt change");
        }
      }

    }
  });
}); //end event

function passUpdate(index,jsonPasswords,user,password) {
          jsonPasswords[index].password = password;
          jsonPasswords[index].username = user;
          var encryptedString = encryptPasswords(JSON.stringify(jsonPasswords),key1);
          console.log("passString after enc = "+encryptedString);
          var hmac = new sjcl.misc.hmac(key2, sjcl.hash.sha256);
          var tag = hmac.mac(encryptedString);
          storePasswords(username,encryptedString,tag);
}


function passInsert (jsonPasswords,host,user,password) {
        jsonPasswords.push({hostname:host , username: user ,password:password });
        var passwordsString = JSON.stringify(jsonPasswords);
        console.log("passString before enc = "+passwordsString);
        var encryptedString = encryptPasswords(passwordsString,key1);
       console.log("passString after enc = "+encryptedString);

        var hmac = new sjcl.misc.hmac(key2, sjcl.hash.sha256);
        var tag = hmac.mac(encryptedString);
        storePasswords(username,encryptedString,tag);
}

function firstPassInsert(host, user, password){
      var jsonPasswords = [{hostname: host,username: user, password: password}];
      var encryptedString = encryptPasswords(JSON.stringify(jsonPasswords),key1);
      console.log("passString after enc = "+encryptedString);
      var hmac = new sjcl.misc.hmac(key2, sjcl.hash.sha256);
      var tag = hmac.mac(encryptedString);
      console.log(tag);
      storePasswords(username,encryptedString,tag);
}


var validUsernameNames = ["email", "user", "username", "id", "emailaddress"];

var isPasswordField = function(input) {
  var type = input.type.toLowerCase();
  return input.offsetParent !== null && type === "password";
}

var isUsernameField= function(input) {
  var name = input.name.toLowerCase();
  var type = input.type.toLowerCase();
  return type === "email" || validUsernameNames.indexOf(name) > -1;
}


function fillFields(request) {
  var passwordEl, usernameEl = null;
  var inputsArray = Array.prototype.slice.call(document.getElementsByTagName("input"), 0 );
  passwordEls = inputsArray.filter(isPasswordField);

  if (passwordEls.length > 0) {
    passwordEl = passwordEls[0];
    passwordEl.value = request.password;
    $(':input').css("background-color","#cfe6fc");

    usernameEl = inputsArray.filter(isUsernameField);
    if (usernameEl.length > 0 ) {
      usernameEl = usernameEl[0];
      usernameEl.value = request.username;
    }
    return true;
  }
  return false;
}

function getPassword() {
  var passwordEl = null;
  var inputsArray = Array.prototype.slice.call(document.getElementsByTagName("input"), 0 );
  passwordEls = inputsArray.filter(isPasswordField);

  if (passwordEls.length) {
    passwordEl = passwordEls[0].value;
    return passwordEl;
  }
  return false;
}

function getUsername() {
  var  usernameEl = null;
  var inputsArray = Array.prototype.slice.call(document.getElementsByTagName("input"), 0 );
  usernameEl = inputsArray.filter(isUsernameField);
  if (usernameEl.length > 0 ) {
    usernameEl = usernameEl[0].value;
    return (usernameEl); 
  }
  return false;
}


function isDocHasPassInput() {
  var passwordEl, usernameEl = null;
  var inputsArray = Array.prototype.slice.call(document.getElementsByTagName("input"), 0 );
  passwordEls = inputsArray.filter(isPasswordField);
  if (passwordEls.length > 0) {
    return true;
  }
  else {
    return false;
  }
}

//[{hostname: "www.sadas.com ",username :"asdasd", password: "asdasd"}  ]
function findIndexOfPassDetails (hostname,jsonPasswords){
  for(var i = 0; i < jsonPasswords.length; i++){
    if(jsonPasswords[i].hostname == hostname){
       return i;
    }
  }
  return -1;

}


function decryptPasswords(passwordsString,key){
  return sjcl.decrypt(key,passwordsString);
}

function encryptPasswords(passwordsString,key){
  return sjcl.encrypt(key,passwordsString);
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


function changePlus(string){
  for(var i=0; i<string.length; i++){
    if(string.charAt(i) == " "){
      string = string.replaceAt(i,"+");
    }
  }
      return string;
}

String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}


function storePasswords(username,passwordsString,tag){
  var xhr = new XMLHttpRequest();
  xhr.open('POST', "http://127.0.0.1:8081/", true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
          console.log("sent tag = " +tag);
  var req = 'type=storePasswordsAndTag&user='+username+'&passwordsString='+encodeURIComponent(passwordsString)+'&tag='+ encodeURIComponent(tag);
  xhr.send(req);

  xhr.onreadystatechange = processRequest;

  function processRequest(e) {

    if (xhr.readyState == 4 && xhr.status == 200) {
      var response = xhr.responseText;

      if(response == "failed"){
        console.log("store passwords string request failed")
      }
      if(response == "store passwords succeed"){
        console.log("store succedd");
      }
    }
  }

}