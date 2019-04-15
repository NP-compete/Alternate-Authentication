/*
 * Developer: Shivam Gangwar
 * Maintainer: Shivam Gangwar
 * Date: 28 Feb 2019
 */


 /*
  * RESULT CODEs
  * 0 - id not found
  * 1 - id deleted
  * 2 - domain deleted beacause of only id
  * 3 - domain not found
  */

const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

const nodePersist = require("node-persist");

//just replace this call with our security algorithm
var crypto = require("crypto");

const path = require('path');

const TEST_BASE_DIR = path.join(__dirname, '/gdriveCred');


storage = nodePersist.create({
        dir: TEST_BASE_DIR,
        encoding: 'utf8',            
          expiredInterval: 2 * 60 * 1000, // every 2 minutes the process will clean-up the expired cache
          // in some cases, you (or some other service) might add non-valid storage files to your
          // storage dir, i.e. Google Drive, make this true if you'd like to ignore these files and not throw an error
          forgiveParseErrors: false
      });

//allow for variable storage --> security feature
storage.initSync();

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.appdata'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.


const TOKEN_PATH = 'token.json';

function deleteId(accountName, username, masterPassword){
  return new Promise((resolve,reject) => {
    // Load client secrets from a local file.
    fs.readFile(__dirname + '/credentials.json', (err, content) => {
      if (err) reject(err);
      // Authorize a client with credentials, then call the Google Drive API.
      authorizeForDeleteId(JSON.parse(content), deleteIdCallback, accountName, username, masterPassword).then(createdResult=>{
           resolve(createdResult);
      }).catch(e =>{
           reject(e.message);
      });
    });
  });
}



/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
 function authorizeForDeleteId(credentials, callback,  accountName, username, masterPassword) {
   const { client_secret, client_id, redirect_uris } = credentials.installed;
   const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
   return new Promise((resolve,reject) => {
       // Check if we have previously stored a token.
       fs.readFile(__dirname + '/gdriveCred/'+TOKEN_PATH, (err, token) => {
         if (err){
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
                 new Promise(function(res, rej){
                 fs.writeFile(__dirname + '/gdriveCred/'+TOKEN_PATH, JSON.stringify(token), (err) => {
                     if (err) rej(err);
                     else res();
                   });
                 }).then(function(oAuth2Client){
                       console.log("[SUCCESS] Token is stored at 'gdriveCred/token.json'");
                       //Calling main function where all the operations will be done.
                       callback(oAuth2Client, accountName, username, masterPassword).then(accounts=>{
                               resolve(accounts);
                       }).catch(e =>{
                            reject(e);
                       });
                 }).catch(function(err) {
                       reject(err);
                 });

             });
           });

         }
         else{
           oAuth2Client.setCredentials(JSON.parse(token));
           callback(oAuth2Client, accountName, username, masterPassword).then( accounts=>{
                resolve(accounts);
           }).catch(e =>{
                reject(e);
           });
         }
       });
     });
 }


 /**
  * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
  */
function deleteIdCallback(auth, accountName, username, masterPassword){
 const drive = google.drive({ version: 'v3', auth});
 return new Promise((resolve,reject) => {
     deleteAccountGdrive(drive, accountName, username, masterPassword).then(deleteResult => {
         resolve(deleteResult);
     }).catch(e => {
         reject(e);
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
        body: fs.createReadStream(__dirname +'/gdriveCred/'+fileName)
      };
      drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
      }, function (err, file) {
        if (err) {
          reject(err);
        }else {
          resolve(file.data.id);
        }
      });
   });
}




function deleteAccountGdrive(drive, fileName, username, key){
  return new Promise(function(resolve, reject){
     searchFileInGdrive(drive,fileName).then(searchResult => {
      if(searchResult === 'FileNotFound'){
        resolve(3);
      }else{
        downloadFileFromAppDataFolder(drive,fileName).then(downloadResult => {

          try{
              if(downloadResult === 'downloadComplete'){
                 let result = deleteAccount(fileName,username,key);
                 if(result == 2){
                   deleteDomainFromGoogleDrive(drive,fileName).then(deleteResult => {
                        resolve(result);
                      }).catch(e => {
                        reject(e);
                      });
                  }
                  else{
                    resolve(result);
                  }
                }
                else {
                  resolve(result);
                }
            }
            catch(e){
              reject(new Error('wrong master password'));
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
        const dest = fs.createWriteStream(__dirname +'/gdriveCred/'+fileName);

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
        resolve(searchResult);
      }
    });
  });
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


function getAccounts(accountName,masterPassword){
    var encryptedAccounts = storage.getItemSync(accountName);
    var accounts = [];

    if(typeof encryptedAccounts !== 'undefined'){
        try{
            let cipher = crypto.createDecipher('aes-256-cbc', masterPassword);
            let decryptedAccounts = cipher.update(encryptedAccounts, 'hex', 'utf8') + cipher.final('utf8');
            accounts = JSON.parse(decryptedAccounts);
        }catch(exception){
            throw new Error(exception);
        }
    }


    return accounts;
}


function deleteAccount(accountName, username, masterPassword){
    try{
        let accounts  = getAccounts(accountName,masterPassword);
        if(accounts.length === 1){
          if(username === accounts[0].username){
              deleteAllAccount(accountName);
              return 2;
          }
          else{
            return 0;
          }

        }
        else{
          let found = 9999;
          for(let i = 0; i < accounts.length; ++i){
              if(username === accounts[i].username){
                  found = i;
              }
          }
          if(found<accounts.length){
                accounts.splice(found,1);
               let temp = saveAccounts(accountName,accounts,masterPassword);
               return 1;
          }else{
              return 0;
          }
        }
    }catch(e){
        throw new Error(e);
    }
}

function deleteAllAccount(domainName){
  try{
    fs.unlinkSync(__dirname +'/gdriveCred/'+domainName)
  }catch(err) {
    throw new Error(err);
  }
}

module.exports = {
  deleteId
}

