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

ipcRenderer.on('logged-in', (event, arg) => {
    console.log("logged in, getting data...");
    getData();
})

ipcRenderer.on('data-received', (event, data) => {
    console.log("Got data: " + data);
})



async function getData() {

    let ids = await backendController.getIds();

    var login = document.getElementById("login");
    login.style.display = "none";

    let idsContainer = document.getElementById("idsContainer");
    let html = "";
    
    html = "<ul>";
    for(var id of ids) {
      html += '<li class="list-group-item">';
      html += "Domain: " + id.domain + " | ";
      html += "Username: " + id.id + " | ";
      html += "Security Level: " + id.securityLevel;

      html += '<select id="" onchange="dropDownChange()">';
      if(id.securityLevel != 0)
        html += '<option value="0">On Premise</option>'
      if(id.securityLevel != 1)
        html += '<option value="1">Google Drive</option>'
      if(id.securityLevel != 3)
        html += '<option value="3">Blockchain</option>'
      bhtml += '</select>';

      html += ''
    
      html += "</li>";
    }  
    html += "</ul>";

    idsContainer.innerHTML = html;

    console.log(JSON.stringify(ids));
}

function dropDownChange(domain, id) {
  
}
