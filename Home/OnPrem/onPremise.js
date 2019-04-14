/*
 * Developer: Soham Dutta
 * Maintainer: Shivam Gangwar
 * Date: 16 Feb 2019
 */

var storage = require("node-persist");

//just replace this call with our security algorithm
var crypto = require("crypto");

var sha1 = require('sha1');

//allow for variable storage --> security feature
storage.initSync({dir:'onPremCred'});


function getIds(masterPassword){
    let domains  = storage.keys();
    let accounts = [];
    for (var i = 0; i < domains.length; i++) {
      let tempAccounts = getAccounts(domains[i],masterPassword);

      for (var j = 0; j < tempAccounts.length; j++) {
          accounts.push({domain:tempAccounts[j].name, id:tempAccounts[j].username, securityLevel: 0});
      }
    }
    return accounts;
}


function getCredentials(name,username,masterPassword){
    let account = [];
    let Accounts = getAccounts(name,masterPassword);
    for (var j = 0; j < Accounts.length; j++) {
        if(Accounts[j].username === username){
          account.push({domain:Accounts[j].name, id:Accounts[j].username,password:Accounts[j].password, securityLevel: 0 });
        }
    }
    return account;
}

function getAccounts(accountName,masterPassword){
    var encryptedAccounts = storage.getItemSync(accountName);
    var accounts = [];
    if(typeof encryptedAccounts !== 'undefined'){
        try{
            // let cipher = crypto.createDecipher('aes-256-cbc', masterPassword);
            // let decryptedAccounts = cipher.update(encryptedAccounts, 'hex', 'utf8') + cipher.final('utf8');
            // accounts = JSON.parse(decryptedAccounts);
            accounts = JSON.parse(encryptedAccounts);
        }catch(exception){
            throw exception;
        }
    }
    return accounts;
}

function getIdsForDomain(domain,masterPassword){
    var encryptedAccounts = storage.getItemSync(domain);
    var accounts = [];
    if(typeof encryptedAccounts !== 'undefined'){
        try{
            // let cipher = crypto.createDecipher('aes-256-cbc', masterPassword);
            // let decryptedAccounts = cipher.update(encryptedAccounts, 'hex', 'utf8') + cipher.final('utf8');
            // accounts = JSON.parse(decryptedAccounts);
            accounts = JSON.parse(encryptedAccounts);
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
        // var cipher = crypto.createCipher('aes-256-cbc', masterPassword);
        // var encrypted = cipher.update(JSON.stringify(accounts), 'utf8', 'hex') + cipher.final('hex');
        storage.setItemSync(accountName, JSON.stringify(accounts));
        return accounts;
    } catch (e) {
        throw e;
    }
}


function saveId(domain,id,pass,masterPassword){
  try{
        var accounts  = getAccounts(domain,masterPassword);
        var found = false;
        for(var i = 0; i < accounts.length; ++i){
            if(id === accounts[i].username){
                found = true;
            }
        }
        if(!found){
            account = {name:domain, username:id, password:pass};
            accounts.push(account);
            return saveAccounts(domain,accounts, masterPassword);
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
        let accounts  = getAccounts(domain, masterPassword);

        let found = 999;
        for(let i = 0; i < accounts.length; ++i){
            if(id === accounts[i].username){
                found = i;
            }
        }
        if(found<accounts.length){
              accounts.splice(found,1);
              accounts.push(account);
            return saveAccounts(domain,accounts,masterPassword);
        }else{
            return accounts;
        }
    }catch(e){
        throw new Error(e.message);
    }
}

function deleteId(domain, username, masterPassword){
    try{
        let accounts  = getAccounts(domain,masterPassword);
        let found = 999;
        for(let i = 0; i < accounts.length; ++i){
            if(username === accounts[i].username){
                found = i;
            }
        }
        if(found<accounts.length){
            accounts.splice(found,1);
            return saveAccounts(domain,accounts,masterPassword);
        }else{
            return accounts;
        }
    }catch(e){
        throw new Error(e.message);
    }
}

function deleteAllAccount(domainName){
  try{
    fs.unlinkSync('onPremCred/'+fileName)
    console.log(BgGreen+"[SUCCESS]"+Reset+'Domain Deleted!');
  }catch(err) {
    console.log(BgRed+"[ERROR]"+Reset+"Unable to delete the file from local directory!");
  }
}

module.exports = {
    getIds,
    getCredentials,
    getAccounts,
    saveId,
    changePasswordForId,
    deleteId,
    getIdsForDomain,
    deleteAllAccount
}
