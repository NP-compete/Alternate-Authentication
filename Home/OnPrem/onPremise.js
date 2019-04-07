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
storage.initSync();

/*
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
            description: 'Enter the master decrytion password here (To be replaced with OTP)',
            type: 'string'
        }
    })
.help('help');
}).command('update','Create an account',function(yargs){
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
            description: 'Enter the master decrytion password here (To be replaced with OTP)',
            type: 'string'
        }
    })
.help('help');
}).command('listAll','List all the accounts',function(yargs){
    yargs.options({
        masterpassword:{
            demand: true,
            alias: 'm',
            description: 'Enter the master decrytion password here (To be replaced with OTP)',
            type: 'string'
        }
    })
.help('help');
}).command('delete','Create an account',function(yargs){
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
            description: 'Enter the master decrytion password here (To be replaced with OTP)',
            type: 'string'
        }
    })
.help('help');
}).command('oneget','get a account',function(yargs){
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
            description: 'Enter the master decrytion password here (To be replaced with OTP)',
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




let command = argv._[0];


//account will have a name ie. Facebook
//account will have a username ie.vinaceto@yahoo
//account will have a password ie. password123

*/

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
            accounts = JSON.parse(encrypted);
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
    fs.unlinkSync('persist/'+fileName)
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

/*
function printAccount(accountsArray){
  console.log("----------------------------------------------");
  for(var i = 0; i < accountsArray.length; ++i){
    console.log(""+(i+1)+".\t",accountsArray[i].username,"\t",accountsArray[i].password);
  }
  console.log("----------------------------------------------");
}


//create/get an account based on the centered command (create/get)

if(command === 'create'){
   try{
        acountLength = getAccounts(argv.name,argv.masterpassword).length;
        var createdAccount = createAccount({
            name: argv.name,
            username: argv.username,
            password: argv.password,
        }, argv.masterpassword);
        if(acountLength != createdAccount.length){
            console.log(BgGreen+"[SUCCESS]"+Reset+"Account Created!");
        }else{
            console.log(BgYellow+"[WARNING]"+Reset+"Account already Exists!");
        }
        printAccount(createdAccount);
    }catch (e){
        console.log("Unable to create account!",e.message);
    }
}else if(command === 'get'){
    try{
        var grabbedAccount = getAccounts(argv.name, argv.masterpassword);
        if( grabbedAccount.length == 0){
            console.log(BgGreen+"[SUCCESS]"+Reset+"Account not found!");
        }else{
            console.log(BgGreen+"[SUCCESS]"+Reset+"Account(s) Found ....");
            printAccount(grabbedAccount);
        }
    }catch (e){
        console.log(BgRed+"[ERROR]"+Reset+"Unable to fetch desired account!",e.message);
    }
}else if(command === 'delete'){
    try{
        let afterDeleteAccounts = deleteAccount(argv.name,argv.username,argv.masterpassword);
        if( afterDeleteAccounts.length == 0){
            deleteAllAccount(argv.name);
        }
        console.log(BgGreen+"[SUCCESS]"+Reset+"Account Deleted ....");
        if( afterDeleteAccounts.length > 0){
            printAccount(afterDeleteAccounts);
        }
    }catch (e){
        console.log(BgRed+"[ERROR]"+Reset+"Unable to delete account!"+e.message);
    }
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
}else if(command === 'listAll'){
    try{
          let array = getDomains(argv.masterpassword);

          console.log(array);


          //for(let i = 0 ; i < array.length ; i++){
          //  console.log("\n",array[i]);
          //}

    }catch (e){
         console.log(BgRed+"[ERROR]"+Reset+"Unable to Update account!"+e.message);
    }
}else if(command === 'oneget'){
    try{
          let cred = getCredentials(argv.name,argv.username,argv.masterpassword);

          console.log(cred);

          //for(let i = 0 ; i < array.length ; i++){
          //  console.log("\n",array[i]);
          //}

    }catch (e){
         console.log(BgRed+"[ERROR]"+Reset+"Unable to Update account!"+e.message);
    }
}

*/
