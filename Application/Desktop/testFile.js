const {ipcRenderer} = require('electron')
const backendController = require('./backend/backendController');

let authId;

let test = document.getElementById("test");

async function requestOtpClicked(phNo) {
  // if(phNo == ""){
  //   var label = document.getElementById("wrong-otp");
  //   label.innerHTML = "Invalid Phone Number";
  // }
  // else{
    var label = document.getElementById("wrong-otp");
    label.innerHTML = "";
    console.log('otp requested: ' + phNo);
    ipcRenderer.send('otp-requested', phNo);
  // }

}
async function loginClicked(otp, masterPasssword) {
  console.log('login Clicked: ' + otp);
  // if(otp == "" || masterPassword == ""){
  //   var label = document.getElementById("wrong-otp");
  //   label.innerHTML = "Invalid OTP or Master Password";
  // }
  // else{
    var label = document.getElementById("wrong-otp");
    label.innerHTML = "";
    ipcRenderer.send('login-clicked', {otp, masterPasssword});
    console.log('login Clicked sent: ');
  // }
}

ipcRenderer.on('invalid-otp', (event, arg) => {
    console.log("wrong otp, logging out...");
    // wrongOtp(); Correct
    getData();
})

ipcRenderer.on('logged-in', (event, arg) => {
    console.log("logged in, getting data...");
    getData();
})

ipcRenderer.on('data-received', (event, data) => {
    console.log("Got data: " + data);
})


async function wrongOtp(){
  var label = document.getElementById("wrong-otp");
  label.innerHTML = "Wrong OTP";
}

async function dropDownChange(domain, id, security) {
  var id =  id;
  var drpdwn = document.getElementById(id);
  var newSecurity = drpdwn.options[drpdwn.selectedIndex].value;
  var data = {domain: domain, id: id, oldSecurity:security, newSecurity:newSecurity};
  console.log(data);
  ipcRenderer.send('change-security', data);
  console.log("change security sent");
}

async function getData() {

    let ids = await backendController.getIds();
    console.log("ids" , ids.domain);

    var login = document.getElementById("login");
    login.style.display = "none";

    let idsContainer = document.getElementById("idsContainer");
    let html = "";

    html = "<table class='table'><tbody>";
    for(var id in ids) {

      html += '<tr>';
      html += "<td>Domain: " + ids[id].domain + "</td>";
      html += "<td>Username: " + ids[id].id + "</td>";
      html += "<td>Security Level: " + ids[id].securityLevel + " ";
      html += `<td><select id="${ids[id].id}" onchange="dropDownChange('${ids[id].domain}', '${ids[id].id}', '${ids[id].securityLevel}')">`;
      if(ids[id].securityLevel == 0)
        html += '<option value="0" selected>On Premise</option>'
      else {
        html += '<option value="0">On Premise</option>'
      }
      if(ids[id].securityLevel == 1)
        html += '<option value="1" selected>Google Drive</option>'
      else {
          html += '<option value="1" >Google Drive</option>'
        }
      if(ids[id].securityLevel == 3)
        html += '<option value="3" selected>Blockchain</option>'
        else {
          html += '<option value="3">Blockchain</option>'
          }
      html += '</select></td>';

      html += '';

    }
    html += "</ul>";

    idsContainer.innerHTML = html;

    console.log(JSON.stringify(ids));
}
