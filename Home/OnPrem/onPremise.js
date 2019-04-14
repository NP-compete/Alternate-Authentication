/*
 * Developer: Shivam Gangwar
 * Maintainer: Gaurav
 * Date: 26 Feb 2019
 */


//just replace this call with our security algorithm
const crypto = require("crypto");
const fs = require("fs");
const sha1 = require('sha1');

const nodePersist1 = require('node-persist');

const path = require('path');

const TEST_BASE_DIR = path.join(__dirname, '/onPremCred');


persist_storage = nodePersist1.create({
				dir: TEST_BASE_DIR,
				encoding: 'utf8',			 			 
			    expiredInterval: 2 * 60 * 1000, // every 2 minutes the process will clean-up the expired cache
			    // in some cases, you (or some other service) might add non-valid persist_storage files to your
			    // persist_storage dir, i.e. Google Drive, make this true if you'd like to ignore these files and not throw an error
			    forgiveParseErrors: false
			});

persist_storage.initSync();

function getAccounts(accountName,masterPassword){
    var encryptedAccounts = persist_storage.getItemSync(accountName);
    var accounts = [];
    if(typeof encryptedAccounts !== 'undefined'){
        try{
            let cipher = crypto.createDecipher('aes-256-cbc', masterPassword);
            let decryptedAccounts = cipher.update(encryptedAccounts, 'hex', 'utf8') + cipher.final('utf8');
            accounts = JSON.parse(decryptedAccounts);
        }catch(exception){
            throw exception;
        }
    }
    return accounts;
}


function getIds(masterPassword){
    let domains  = persist_storage.keys();
    let accounts = [];
    for (var i = 0; i < domains.length; i++) {
      let tempAccounts = getAccounts(domains[i],masterPassword);

      for (var j = 0; j < tempAccounts.length; j++) {
          accounts.push({domain:tempAccounts[j].name, id:tempAccounts[j].username, securityLevel: 0});
      }
    }
    return accounts;
}


function getPasswordForId(name,username,masterPassword){
    let account;
    let Accounts = getAccounts(sha1(name),masterPassword);
    for (var j = 0; j < Accounts.length; j++) {
        if(Accounts[j].username === username){
          account = Accounts[j].password;
        }
    }
    return account;
}


function getIdsForDomain(domain,masterPassword){
    var encryptedAccounts = persist_storage.getItemSync(sha1(domain));
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
    let returningAccount = [];
    for (let index = 0; index < accounts.length; index++) {
        const element = accounts[index];
        returningAccount.push({domain:element.name, id:element.username, password:element.password, securityLevel:1});
    }
    return returningAccount;
}



function saveAccounts(accountName, accounts, masterPassword){
    try {
        var cipher = crypto.createCipher('aes-256-cbc', masterPassword);
        var encrypted = cipher.update(JSON.stringify(accounts), 'utf8', 'hex') + cipher.final('hex');
        persist_storage.setItemSync(accountName, encrypted);
        return accounts;
    } catch (e) {
        throw e;
    }
}


function saveId(domain,id,pass,masterPassword){
  try{
        var accounts  = getAccounts(sha1(domain),masterPassword);
        var found = false;
        for(var i = 0; i < accounts.length; ++i){
            if(id === accounts[i].username){
                found = true;
            }
        }
        if(!found){
            account = {name:domain, username:id, password:pass};
            accounts.push(account);
            return saveAccounts(sha1(domain),accounts, masterPassword);
        }else{
            return accounts;
        }
    }catch(e){
        throw e;
    }
}


function changePasswordForId(domain, id, pass, masterPassword){

    account = {name:domain, username:id, password:pass};
    try{
        let accounts  = getAccounts(sha1(domain), masterPassword);

        let found = 9999999;
        for(let i = 0; i < accounts.length; ++i){
            if(id === accounts[i].username){
                found = i;
            }
        }
        if(found<accounts.length){
              accounts.splice(found,1);
              accounts.push(account);
            return saveAccounts(sha1(domain),accounts,masterPassword);
        }else{
            return accounts;
        }
    }catch(e){
        throw new Error(e.message);
    }
}

function deleteId(domain, username, masterPassword){
    try{
        let accounts  = getAccounts(sha1(domain),masterPassword);
        let found = 999;
        for(let i = 0; i < accounts.length; ++i){
            if(username === accounts[i].username){
                found = i;
            }
        }
        if(found<accounts.length){
            accounts.splice(found,1);
            return saveAccounts(sha1(domain),accounts,masterPassword);
        }else{
            return accounts;
        }
    }catch(e){
        throw new Error(e.message);
    }
}

function deleteAllAccount(domainName){
  try{
  	fileName = sha1(domainName);
    fs.unlinkSync(TEST_BASE_DIR+'/'+fileName);
  }catch(err) {
    throw err;
  }
}

module.exports = {
    getIds,
    getPasswordForId,
    saveId,
    changePasswordForId,
    deleteId,
    getIdsForDomain,
    deleteAllAccount
}
