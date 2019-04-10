/*
getting user informatinoi from background, stores it at local storage
 */
var hostname = window.location.hostname;

var port = chrome.extension.connect({
  name: "Sample Communication"
});

port.onMessage.addListener(function (msg) {
  //handling messages return from background
  console.log("message recieved: " + msg.type);
  if (msg.type == "connected") {
    onLoad();
  }
});

//checking if user is already connected
port.postMessage({ type: "isConnected" });

/*
running at document start
 */

function onLoad() {
  console.log("user connected");
  getPasswords(function (response) {
    console.log(response);
    response = JSON.parse(response);
    var jsonPasswords, jsonUser, securityLevel, flag;
    for(var i in response){
      if(response[i] != null){
        console.log(response[i].id);
        if(response[i].domain == hostname){
          flag = i;
           jsonUser = response[i].id;
           securityLevel = response[i].securityLevel;
           jsonPasswords = response[i].password;
        }
        else{
          console.log("No domain", hostname);
        }
      }
      console.log("got pass from server: " + jsonUser); //
      if (jsonUser == "") { //if no passwords stored for this user
        console.log("no passwords for this user");
        return;
    }

  }

  if(jsonUser && jsonPasswords){
    fillFields(response[flag]);
  }

    // if (isDocHasPassInput()) {//if the doc has input fields
    //   console.log("doc has pass input");
    //   //checking if passwords exist for this specific hostname. return index of passwords or -1 if not exist.
    //   var index = findIndexOfPassDetails(hostname, jsonPasswords);
    //   if (index > -1) {
    //     console.log("found password for this hostname");
    //     fillFields(jsonPasswords[index]);
    //
    //   }
    //   else {
    //     console.log("no passwords found for this hostname");
    //   }
    // }

  });
}


/*
update passwords in the database or adding them if not exist
 */
document.addEventListener("submit", function () {
  if (username == null) {
    return;
  }
  //gets input information
  var password = getPassword();
  var username = getUsername();

  storePasswords({hostname, username, password});
}); //end event

var validUsernameNames = ["email", "user", "username", "id", "emailaddress"];

var isPasswordField = function (input) {
  var type = input.type.toLowerCase();
  return input.offsetParent !== null && type === "password";
}

var isUsernameField = function (input) {
  var name = input.name.toLowerCase();
  var type = input.type.toLowerCase();
  return type === "email" || validUsernameNames.indexOf(name) > -1;
}


function fillFields(request) {
  var passwordEl, usernameEl = null;
  var inputsArray = Array.prototype.slice.call(document.getElementsByTagName("input"), 0);
  passwordEls = inputsArray.filter(isPasswordField);

  if (passwordEls.length > 0) {
    console.log(passwordEls);
    passwordEl = passwordEls[0];
    passwordEl.value = request.password;
    $(':input').css("background-color", "#cfe6fc");

    usernameEls = inputsArray.filter(isUsernameField);
    console.log(usernameEls);
    if (usernameEls.length > 0) {
      usernameEl = usernameEls[0];
      usernameEl.value = request.id;
    }
    return true;
  }
  return false;
}

function getPassword() {
  var passwordEl = null;
  var inputsArray = Array.prototype.slice.call(document.getElementsByTagName("input"), 0);
  passwordEls = inputsArray.filter(isPasswordField);

  if (passwordEls.length) {
    passwordEl = passwordEls[0].value;
    return passwordEl;
  }
  return false;
}

function getUsername() {
  var usernameEl = null;
  var inputsArray = Array.prototype.slice.call(document.getElementsByTagName("input"), 0);
  usernameEls = inputsArray.filter(isUsernameField);
  if (usernameEls.length > 0) {
    usernameEl = usernameEls[0].value;
    return (usernameEl);
  }
  return false;
}


function isDocHasPassInput() {
  var inputsArray = Array.prototype.slice.call(document.getElementsByTagName("input"), 0);
  passwordEls = inputsArray.filter(isPasswordField);
  if (passwordEls.length > 0) {
    return true;
  }
  else {
    return false;
  }
}

//[{hostname: "www.sadas.com ",username :"asdasd", password: "asdasd"}]
function findIndexOfPassDetails(hostname, jsonPasswords) {
  for (var i = 0; i < jsonPasswords.length; i++) {
    if (jsonPasswords[i].hostname == hostname) {
      return i;
    }
  }
  return -1;

}


function decryptPasswords(passwordsString, key) {
  return sjcl.decrypt(key, passwordsString);
}

function encryptPasswords(passwordsString, key) {
  return sjcl.encrypt(key, passwordsString);
}

function getPasswords(callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', "http://127.0.0.1:8081/", true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  var req = 'type=getPasswords';
  xhr.send(req);
  xhr.onreadystatechange = processRequest;
  function processRequest(e) {

    if (xhr.readyState == 4 && xhr.status == 200) {
      var response = xhr.responseText;

      if (response == "failed") {
        console.log("get passwords string request failed")
      }

      if (response.length > 0) {
        callback(response);
        return response;
      }
    }
  }
}


function changePlus(string) {
  for (var i = 0; i < string.length; i++) {
    if (string.charAt(i) == " ") {
      string = string.replaceAt(i, "+");
    }
  }
  return string;
}

String.prototype.replaceAt = function (index, replacement) {
  return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}


function storePasswords(passwordsString) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', "http://127.0.0.1:8081/", true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  var req = 'type=storePasswords&passwordsString=' + encodeURIComponent(passwordsString);
  xhr.send(req);

  xhr.onreadystatechange = processRequest;

  function processRequest(e) {

    if (xhr.readyState == 4 && xhr.status == 200) {
      var response = xhr.responseText;

      if (response == "failed") {
        console.log("store passwords string request failed")
      }
      if (response == "store passwords succeed") {
        console.log("store succedd");
      }
    }
  }

}
