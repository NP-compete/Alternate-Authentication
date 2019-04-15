const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
ELECTRON_ENABLE_LOGGING=1;

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  const trayIcon = path.join(__dirname, 'assets/icons/icon2.png');

  // Create the browser window.
  //mainWindow = new BrowserWindow({width: 800, height: 600})
  mainWindow = new BrowserWindow({backgroundColor: "#E2E2E2", icon: trayIcon})

  // Load Menu and maximize
  require('.')

  mainWindow.maximize()

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


const {ipcMain} = require('electron')
const otpAuth = require('./backend/OTP/otpAuth');
const backendController = require('./backend/backendController');

let otpAuthId;

// Event handler for asynchronous incoming messages
ipcMain.on('otp-requested', async function (event, phno) {
  console.log('otp requested: ' + phno);

  otpAuthId = await otpAuth.sendOtp(phno);
})

// Event handler for synchronous incoming messages
ipcMain.on('login-clicked', async (event, info) => {

  console.log("otp entered " + JSON.stringify(info));

  // let verified = true;
  try {

    let verified = await otpAuth.verifyOtp(info.otp, otpAuthId);
    console.log("Verified value " + verified);
    event.sender.send('logged-in');

  }catch {
    event.sender.send('invalid-otp');
  }
})

async function getAndSendIds(callback) {
  try {
    let ids = await backendController.getIds();
    callback(ids);
  } catch(e) {
    console.log(e);
  }
}

ipcMain.on('data-request', function (event, vars) {
  getAndSendIds((ids) => {
    event.sender.send('data-received', ids);
  });
})

ipcMain.on('change-security', async (event, info) => {

  console.log("security changed " + JSON.stringify(info));
  var flag = await backendController.addThis(info.domain, info.id, parseInt(info.newSecurity), parseInt(info.oldSecurity));
  // backendController.addId(info.domain, info.id, info.password, parseInt(info.newSecurity));
})

ipcMain.on('invalid', (event, data) => {
  let test = document.getElementById("test");
    var label = document.getElementById("wrong-otp");
    label.innerHTML = "Invalid Data entry";
})


//
//     function showList(){
//       let ids = getIds();
//        console.log(ids);
//       let listContainer = document.getElementById("list");
//       // let html = "";
//       //
//       // html = "<ul>";
//       // for(var id of ids) {
//       //   html += "<li>";
//       //   html += "Domain: " + id.domain + " | ";
//       //   html += "Username: " + id.username + " | ";
//       //   html += "Security Level: " + id.security_level;
//       //
//       //     html += "</li>";
//       // }
//       //
//       //             html += "</ul>";
//       listContainer.innerHTML = ids;
//   // document.getElementById("list").innerHTML = JSON.stringify(obj);
//   // var div = document.createElement("div");
//   // //domain
//   // var domain = document.createTextNode("Domain : " + obj['domain']);
//   // div.appendChild(domain);
//   // //new line
//   // div.appendChild(document.createElement("br"));
//   // //username
//   // var user = document.createTextNode("Username : " + obj['username']);
//   // div.appendChild(user);
//   // //newline
//   // div.appendChild(document.createElement("br"));
//   // //security lvl
//   // var select = document.createTextNode("Security level");
//   // div.appendChild(select);
//   // var select = document.createElement("SELECT");
//   // select.setAttribute("id", "security_lvl");
//   // document.body.appendChild(select);
//   // for(i = 1; i <=3; i++){
//   //     var option = document.createElement("option");
//   //     option.setAttribute("value", "level" + i);
//   //     if(i == obj['security_level'])
//   //         option.setAttribute("selected", 'true');
//   //     var txt = document.createTextNode("level" + i);
//   //     option.appendChild(txt);
//   //     document.getElementById("security_lvl").appendChild(option);
//   // }
//   // div.appendChild(select);
//   //
//   // document.body.appendChild(div);
// }
