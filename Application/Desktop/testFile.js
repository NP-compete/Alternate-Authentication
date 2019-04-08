const {ipcRenderer} = require('electron')
const backendController = require('./backend/backendController');

let authId;

let test = document.getElementById("test");

async function requestOtpClicked(phNo) {
  console.log('otp requested: ' + phNo);
  ipcRenderer.send('otp-requested', phNo);
}
async function loginClicked(otp, masterPasssword) {
  console.log('login Clicked: ' + otp);
  ipcRenderer.send('login-clicked', {otp, masterPasssword});
  console.log('login Clicked sent: ');
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
  ipcRenderer.send('change-security', {domain, id, security});
}

async function getData() {

    let ids = await backendController.getIds();

    var login = document.getElementById("login");
    login.style.display = "none";

    let idsContainer = document.getElementById("idsContainer");
    let html = "";

    html = "<table class='table'><tbody>";
    for(var id of ids) {

      html += '<tr>';
      html += "<td>Domain: " + id.domain + "</td>";
      html += "<td>Username: " + id.id + "</td>";
      html += "<td>Security Level: " + id.securityLevel + " ";
      html += `<td><select onchange="dropDownChange('${id.domain}, ${id.id}, ${id.securityLevel}')">`;
      if(id.securityLevel != 0)
        html += '<option value="0">On Premise</option>'
      if(id.securityLevel != 1)
        html += '<option value="1">Google Drive</option>'
      if(id.securityLevel != 3)
        html += '<option value="3">Blockchain</option>'
      html += '</select></td>';

      html += '';

    }
    html += "</ul>";

    idsContainer.innerHTML = html;

    console.log(JSON.stringify(ids));
}
