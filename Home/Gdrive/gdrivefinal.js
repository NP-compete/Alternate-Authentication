/*
 * Developer: Shivam Gangwar
 * Maintainer: Gaurav
 * Date: 19 Feb 2019
 */

const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

const storage = require("node-persist");

//just replace this call with our security algorithm
var crypto = require("crypto");

//allow for variable storage --> security feature
storage.initSync();

const BgRed = "\x1b[41m"
const BgGreen = "\x1b[42m"
const BgYellow = "\x1b[43m"
const Reset = "\x1b[0m"
const Blink = "\x1b[5m"

var argv = require("yargs").command('create','Create an account',function(yargs){
    yargs.options({
        name:{
            demand: true,
            alias: 'n',
            description:'Your Domain goes here',
            type: 'string'
        },
        username:{
            demand: true,
            alias: 'u',
            description: 'Your username goes here',
            type:'string'
        },
        password:{
            demand: true,
            alias: 'p',
            description: 'Your password goes here',
            type: 'string'
        },

        // Replace with OTP
        masterpassword:{
            demand: true,
            alias: 'm',
            description: 'Enter the master decrytion password here',
            type: 'string'
        }
    })
.help('help');
}).command('update','Update an account',function(yargs){
    yargs.options({
        name:{
            demand: true,
            alias: 'n',
            description:'Your Domain goes here',
            type: 'string'
        },
        username:{
            demand: true,
            alias: 'u',
            description: 'Your username goes here',
            type:'string'
        },
        password:{
            demand: true,
            alias: 'p',
            description: 'Your new password goes here',
            type: 'string'
        },

        // Replace with OTP
        masterpassword:{
            demand: true,
            alias: 'm',
            description: 'Enter the master decrytion password here ',
            type: 'string'
        }
    })
.help('help');
}).command('delete','Delete an account',function(yargs){
    yargs.options({
        name:{
            demand: true,
            alias: 'n',
            description:'Your Domain goes here',
            type: 'string'
        },
        username:{
            demand: true,
            alias: 'u',
            description: 'Your username goes here',
            type:'string'
        },
        // Replace with OTP
        masterpassword:{
            demand: true,
            alias: 'm',
            description: 'Enter the master decrytion password here ',
            type: 'string'
        }
    })
.help('help');
}).command('getIds','list all accounts',function(yargs){
    yargs.options({
        masterpassword:{
            demand: true,
            alias: 'm',
            description: 'Enter the master decrytion password here',
            type: 'string'
        }
    })
.help('help');
}).command('getDomains','list all domains',function(yargs){
    yargs.options({
        masterpassword:{
            demand: true,
            alias: 'm',
            description: 'Enter the master decrytion password here ',
            type: 'string'
        }
    })
.help('help');
}).command('list','list all domains',function(yargs){
    yargs.options({
        masterpassword:{
            demand: true,
            alias: 'm',
            description: 'Enter the master decrytion password here ',
            type: 'string'
        }
    })
.help('help');
}).command('get', 'Get your account information', function(yargs){
          yargs.options({
              name: {
                  demand: true,
                  alias: 'n',
                  description: 'Your account name goes here',
                  type: 'string'
              },
            masterpassword:{
            demand: true,
            alias: 'm',
            description: 'Enter the master decrytion password here',
            type: 'string'
        }
          }).help('help');
    })
   .help('help')
   .argv


var command = argv._[0];

//account will have a name ie. Facebook
//account will have a username ie.vinaceto@yahoo
//account will have a password ie. password123


// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.appdata'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.


const TOKEN_PATH = 'token.json';


function run(credentialsFileName,callback2){

  // Load client secrets from a local file.
  fs.readFile(credentialsFileName, (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
      // Authorize a client with credentials, then call the Google Drive API.
      authorize(JSON.parse(content), authorizedCallback,callback2);
  });

}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback, callback2) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile('persist/'+TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client, callback2);
  });
}

/*
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback, callback2) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('[ALERT] Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('\n[INPUT] Enter the code from that page here: ', (code) => {
    rl.close();
     oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);

      // Store the token to disk for later program executions
      return new Promise(function(resolve, reject){
      fs.writeFile('persist/'+TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) reject(err);
          else resolve(); 
        });
      }).then(function(oAuth2Client){
            console.log("[SUCCESS] Token is stored at 'persist/token.json'");
            //Calling main function where all the operations will be done.
            callback(oAuth2Client, callback2);
      }).catch(function(err) {
            console.log("[ERROR] Error here: " + err);
      });        

    });
  });
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function authorizedCallback(auth, call_function) {
  const drive = google.drive({ version: 'v3', auth});  
  if(command === 'create'){
      saveId(drive,{
          name: argv.name,
          username: argv.username,
          password: argv.password,
      },argv.masterpassword).then(createdResult => {
          console.log("CreatedResult  -", createdResult);  
      }).catch(e => {
          console.log("Unable to create account!",e.message);
      });

  }else if(command === 'get'){
        getIdsForDomain(drive,argv.name, argv.masterpassword).then(grabbedAccount => {
           console.log(grabbedAccount);  
        }).catch(e => {
          console.log(BgRed+"[ERROR]"+Reset+" Unable to fetch desired account!",e.message);
        });
  }else if(command === 'delete'){
        deleteId(drive,argv.name,argv.username,argv.masterpassword).then(deleteResult => {
            console.log(" DELETE RESULT - ",deleteResult);
        }).catch(e =>{
            console.log(BgRed+"[ERROR]"+Reset+"Unable to delete account!"+e.message);
        });

  }else if(command === 'update'){
     try{
          var afterUpdateAccounts = updateAccount({
              name: argv.name,
              username: argv.username,
              password: argv.password,
          }, argv.masterpassword);
          
          console.log(BgGreen+"[SUCCESS]"+Reset+"[SUCCESS] Account Updated!");
          printAccount(afterUpdateAccounts);
      }catch (e){
          console.log(BgRed+"[ERROR]"+Reset+"Unable to Update account!"+e.message);
      }
  }else if(command === 'list'){
     try{
          listFiles(drive);
      }catch (e){
          console.log(BgRed+"[ERROR]"+Reset+"Unable to List All Accounts!");
      }
  }else if(command === 'getIds'){
      console.log(storage.keys());
      getIds(drive,argv.masterpassword).then(accounts=>{
        let i = 1;
        console.log("\nList of all Accounts on Gdrive...\n\n+---------------------------------------------------------------------------------------+");
        console.log("| Domain\t\t   username\t\t    password\t\tsecurityLevel\t|"); 
        console.log("+---------------------------------------------------------------------------------------+");
       
        for (let i = 0; i < accounts.length; i++){
          console.log('|',accounts[i].domain,'\t\t', accounts[i].id,"\t", accounts[i].pass,"      \t     ",accounts[i].securityLevel,'\t|');
          }

        console.log("+---------------------------------------------------------------------------------------+");


      }).catch(e =>{
          console.log(e.message);
      });
  }
  else if(command === 'getDomains'){
      console.log(storage.keys());
      getDomains(drive,argv.masterpassword).then(accounts=>{
        let i = 1;
        console.log("\nList of all Accounts on Gdrive...\n\n+------------------------------------------------------------------------------------+");
        console.log("| Domain\t\t\t   username\t\t\t   securityLevel     |"); 
        console.log("+------------------------------------------------------------------------------------+");
       
        for (let i = 0; i < accounts.length; i++){
          console.log('|',accounts[i].domain,'\t\t\t', accounts[i].id," \t\t\t", accounts[i].securityLevel,'\t     |');
          }

        console.log("+------------------------------------------------------------------------------------+");


      }).catch(e =>{
          console.log(e.message);
      });
  }
}



function getDomains(drive,masterPassword){
 return new Promise((resolve,reject) => { 
  downloadAllFilesFromTheGoogleDrive(drive).then(()=>{
    let domains  = storage.keys();
    let accounts = [];
    for (var i = 0; i < domains.length; i++) {
      if(domains[i] !== 'token.json'){
        let tempAccounts = getAccounts(domains[i], masterPassword);
        for (var j = 0; j < tempAccounts.length; j++) {  
          let account = {domain:tempAccounts[j].name, id:tempAccounts[j].username, securityLevel: 1};
          accounts.push(account);
        }
      }
    }
    resolve(accounts);
  });
 }).catch(e =>{
  reject(e);
 });
}


function getIds(drive,masterPassword){
 return new Promise((resolve,reject) => {   
    downloadAllFilesFromTheGoogleDrive(drive).then(()=>{
        let domains  = storage.keys();
        let accounts = [];
        for (var i = 0; i < domains.length; i++) {
          if(domains[i] !== 'token.json'){  
            let tempAccounts = getAccounts(domains[i],masterPassword);

            for (var j = 0; j < tempAccounts.length; j++) {
                accounts.push({domain:tempAccounts[j].name, id:tempAccounts[j].username,  pass:tempAccounts[j].password, securityLevel: 1});
            }
          } 
        }
        resolve(accounts);
    });
 }).catch(e =>{
  reject(e);
 });     
}


function downloadAllFilesFromTheGoogleDrive(drive){
return new Promise((resolve,reject) => {
  drive.files.list({
      spaces: 'appDataFolder',
      fields: 'nextPageToken, files(id, name)',
      pageSize: 100
    }, function (err, res) {
        if (err) {
          console.error(err);
          reject(err);
        }else{
          let i = 0;
          for(let file of res.data.files) {
            
            if(file.name != '_init'){ 
            const dest = fs.createWriteStream('persist/'+file.name);

            drive.files.get({
            spaces: 'appDataFolder',
            fileId: file.id,
            alt: 'media'
           }, 
            {responseType: 'stream'},
            function(err, res){
              res.data
                .on('end', () => {
                  dest.end();
                })
                .on('error', err => {
                  console.log('Error', err);
                })
                .pipe(dest);
            }); 
          }
        }
        resolve();
      }
  });
});
   
}



function uploadFileToDrive(drive,fileName){
  return new Promise(function(resolve, reject){
      const fileMetadata = {
        'name': fileName,
        'parents': ['appDataFolder']
      };
      const media = {
        mimeType: 'application/json',
        body: fs.createReadStream('persist/'+fileName)
      };
      drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
      }, function (err, file) {
        if (err) {
          reject(err);
          console.error(err);
        }else {
          resolve(file.data.id);
        }
      });
   });
}


function saveId(drive,account,key){
  fileName = account.name;
  return new Promise(function(resolve, reject){ 
     searchFileInGdrive(drive,fileName).then(searchResult => {
      if(searchResult === 'FileNotFound'){
        let accounts = createAccount(account,key);
        uploadFileToDrive(drive,fileName).then(uploadResult => {
          //deleteAllAccount(fileName);
          resolve(1);
        }).catch(e => {
          reject(e);
        });
      }else{
        downloadFileFromAppDataFolder(drive,fileName).then(downloadResult => {
          if(downloadResult === 'downloadComplete'){
            beforeAcountLength = getAccounts(fileName,key).length;
            let createdAccounts = createAccount(account,key); 
            if(beforeAcountLength !== createdAccounts.length){
              deleteDomainFromGoogleDrive(drive,fileName).then(deleteResult => {
                
                uploadFileToDrive(drive,fileName).then(uploadResult => {
                    //deleteAllAccount(fileName);
                    resolve(2);
                  }).catch(e => {
                    console.log('[ERROR] File not uploaded successfully!\n  ---[WARNING] NOT DELETED FROM LOACL DIRECTORY !');
                    reject(e);
                  });
              });
            }else{
              //deleteAllAccount(fileName);
              resolve(0);
            }
          }
        }).catch(e => {
          reject(e);
        })
      }
    }).catch(e => {
      reject(e);
    })
  });
}


function deleteId(drive,domain,id,key){
  fileName = domain;
  return new Promise(function(resolve, reject){ 
     searchFileInGdrive(drive,fileName).then(searchResult => {
      if(searchResult === 'FileNotFound'){
          resolve(-1);
      }else{
        downloadFileFromAppDataFolder(drive,fileName).then(downloadResult => {
          if(downloadResult === 'downloadComplete'){
            beforeAccount = getAccounts(fileName,key);
            // console.log("beforeAcount -- ");
            // printAccounts(beforeAccount);
            let afterAccounts = deleteAccount(domain,id,key); 
            if(beforeAccount.length !== afterAccounts.length){
              // printAccounts(afterAccounts); 
              // console.log("afterAcount -- ");
              deleteDomainFromGoogleDrive(drive,fileName).then(deleteResult => {
                if(afterAccounts.length !== 0){ 
                  uploadFileToDrive(drive,fileName).then(uploadResult => {
                    resolve(1);
                  }).catch(e => {
                    reject(e);
                  });
                }
              });
            }else{
              //deleteAllAccount(fileName);
              resolve(0);
            }
          }
        }).catch(e => {
          reject(e);
        })
      }
    }).catch(e => {
      reject(e);
    })
  });
}



function downloadFileFromAppDataFolder(drive, fileName){
  return new Promise(function(resolve, reject){  
    searchFileInGdrive(drive,fileName).then(searchResult => {
      if(searchResult !== 'FileNotFound'){
        const dest = fs.createWriteStream('persist/'+fileName);
      
        drive.files.get({
        spaces: 'appDataFolder',
        fileId: searchResult,
        alt: 'media'
        }, 
        {responseType: 'stream'},
        function(err, res){
          res.data
            .on('end', () => {
              dest.end();
              resolve("downloadComplete");
            })
            .on('error', err => {
              console.log('Error', err);
              reject(err);
            })
            .pipe(dest);
        });
      }else{
        reject(searchResult);
      }
    });
  });  
}
 

function downloadAllFilesFromTheGoogleDrive(drive){
return new Promise((resolve,reject) => {
  drive.files.list({
      spaces: 'appDataFolder',
      fields: 'nextPageToken, files(id, name)',
      pageSize: 100
    }, function (err, res) {
        if (err) {
          console.error(err);
          reject(err);
        }else{
          let i = 0;
          for(let file of res.data.files) {
            
            if(file.name != '_init'){ 
            const dest = fs.createWriteStream('persist/'+file.name);

            drive.files.get({
            spaces: 'appDataFolder',
            fileId: file.id,
            alt: 'media'
            }, 
            {responseType: 'stream'},
            function(err, res){
              res.data
                .on('end', () => {
                  dest.end();
                })
                .on('error', err => {
                  console.log('Error', err);
                })
                .pipe(dest);
            }); 
            console.log(" ",++i,'-\t', file.name);
          }
        }
        console.log("downloaded!");
        resolve();
      }
  });
});
   
}

function deleteDomainFromGoogleDrive(drive,fileName) {    
  return new Promise(function(resolve, reject){  
    searchFileInGdrive(drive,fileName).then(searchResult => {
      if(searchResult !== 'FileNotFound'){
        drive.files.delete({
            fileId: searchResult
        }, function (err, response) {
          if (err){
                reject(err);
          }else{
                resolve("Deleted");                 
          }
        });
      }else{
        reject(searchResult);
      }
    });
  });   
}


function getIdsForDomain(drive,domain,key){
  return new Promise(function(resolve, reject){ 
    searchFileInGdrive(drive,domain).then(searchResult => {
      if(searchResult === 'FileNotFound'){
          console.log("Account does't Exists!");
          resolve(searchResult);
      }else{
        downloadFileFromAppDataFolder(drive,domain).then(downloadResult => {
          if(downloadResult === 'downloadComplete'){
            let grabbedAccount = getAccounts(domain,key);
            //deleteAllAccount(fileName);
            resolve(grabbedAccount);
          }          
        }).catch(e => {
          reject(e);
        });
      }
    }).catch(e => {
      reject(e);
    })
  }).catch(e =>{
    reject(e);
  })
}


function searchFileInGdrive(drive,fileName) {
  let found = false;
  return new Promise(function(resolve, reject){  
    drive.files.list({
      spaces: 'appDataFolder',
      fields: 'nextPageToken, files(id, name)',
      pageSize: 100
    }, function (err, res) {
      if (err) {
         reject(err);
         console.error(err);
      }
      else {
        let fileId = 'FileNotFound';
        res.data.files.forEach(function (file) {
          if(file.name === fileName){
              found = true;
              fileId = file.id;
              resolve(fileId);
          } 
        });
        if(found === false){
          resolve(fileId);
        }
      }
    });
  });
}


//will remove this function later (debugging only!)
function listFiles(drive) {
return new Promise(function(resolve, reject){  
  drive.files.list({
    spaces: 'appDataFolder',
    fields: 'nextPageToken, files(id, name)',
    pageSize: 100
  }, function (err, res) {
    if (err) {
      reject(err);
      console.error(err);
    } else {
      let i = 1;
      console.log("\nList of all Accounts on Gdrive...\n\n+------------------------------------------------------------------------------------+");
      console.log("|S.No\t fileName\t\t\t\tFile-Id\t\t\t\t     |"); 
      console.log("+------------------------------------------------------------------------------------+");
     
      res.data.files.forEach(function (file) {
        if(file.name != '_init'){
        console.log('|',i++,'- \t', file.name,"         \t", file.id,'|');
        }
      });
      console.log("+------------------------------------------------------------------------------------+");
      resolve();
    }
  });
});
}


function getAccounts(accountName,masterPassword){
    var encryptedAccounts = storage.getItemSync(accountName);
    var accounts = [];

    if(typeof encryptedAccounts !== 'undefined'){
        try{ 
            let cipher = crypto.createDecipher('aes-256-cbc', masterPassword);
            let decryptedAccounts = cipher.update(encryptedAccounts, 'hex', 'utf8') + cipher.final('utf8');
            accounts = JSON.parse(decryptedAccounts);
        }catch(exception){
            throw new Error(exception.message);
        }
    }


    return accounts;
}

function saveAccounts(accountName, accounts, masterPassword){
    try {
        var cipher = crypto.createCipher('aes-256-cbc', masterPassword);
        var encrypted = cipher.update(JSON.stringify(accounts), 'utf8', 'hex') + cipher.final('hex');
        storage.setItemSync(accountName, encrypted);
        return accounts;
    } catch (e) {
        throw new Error(e.message);
    }
}


function createAccount(account, masterPassword){
  try{
        accountName = account.name;
        var accounts  = getAccounts(accountName,masterPassword);
        var found = false;
        for(var i = 0; i < accounts.length; ++i){
            if(account.username === accounts[i].username){
                found = true;
            }
        }
        if(!found){
            accounts.push(account);
            return saveAccounts(accountName,accounts,masterPassword);
        }else{
            return accounts;
        }
    }catch(e){
        throw new Error(e.message);
    }
}


function updateAccount(account, masterPassword){
    try{   
        let accounts  = getAccounts(account.name,masterPassword);
        
        let found = 999;
        for(let i = 0; i < accounts.length; ++i){
            if(account.username === accounts[i].username){
                found = i;
            }
        }
        if(found<accounts.length){
              accounts.splice(found,1);
              accounts.push(account);
            return saveAccounts(account.name,accounts,masterPassword);
        }else{
            return accounts;
        }
    }catch(e){
        throw new Error(e.message);
    }
}

function deleteAccount(accountName, username, masterPassword){
    try{
        let accounts  = getAccounts(accountName,masterPassword);
        let found = 999;

        if(accounts.length === 0){
          deleteAllAccount(accountName);
        }
        for(let i = 0; i < accounts.length; ++i){
            if(username === accounts[i].username){
                found = i;
            }
        }
        if(found<accounts.length){
              accounts.splice(found,1);
            return saveAccounts(accountName,accounts,masterPassword);
        }else{
            return accounts;
        } 
    }catch(e){
        throw new Error(e.message);
    }   
}

function deleteAllAccount(domainName){
  try{
    fs.unlinkSync('persist/'+fileName)
    console.log(BgGreen+"[SUCCESS]"+Reset+'Domain Totally Deleted!');
  }catch(err) {
    console.log(BgRed+"[ERROR]"+Reset+"Unable to delete the file from local directory!");
  }  
}


function printAccounts(accountsArray){
  console.log("------------------------------------------------------------");
  for(var i = 0; i < accountsArray.length; ++i){
    console.log(""+(i+1)+".\t",accountsArray[i].username,"\t",accountsArray[i].password);    
  }
  console.log("------------------------------------------------------------");
}

run('credentials.json');