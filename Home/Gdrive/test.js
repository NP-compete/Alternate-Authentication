
/*
const BgRed = "\x1b[41m"
const BgGreen = "\x1b[42m"
const BgYellow = "\x1b[43m"
const Reset = "\x1b[0m"
const Blink = "\x1b[5m"

*/


const readline = require('readline');

const GetIds = require('./getIds');
const CleanLocalDirectory = require('./cleanLocalDirectory');
const DownloadAllDomains = require('./downloadAllDomains');
const GetDomains = require('./getDomains');
const GetPasswordForId = require('./getPasswordForId');
const UpdateId = require('./updateId');
const DeleteId = require('./deleteId');
const GetIdForDomain = require('./getIdForDomain');
const SaveId = require('./saveId');


DownloadAllDomains.downloadAllDomains().then(result => {
	console.clear();
	let d = '';
	GetIds.getIds('master@123').then(result => {
	  for(var i = 0; i < result.length; ++i){
	    if(result[i].domain !== d){
	    	console.log(result[i].domain);	
	    	d = result[i].domain;
	    }
	    console.log("    ",result[i].id,"\t",result[i].password,"\t",result[i].securityLevel);
	  }
	}).then( res => {
		console.log("\n\n-------------------------- MENU --------------------------");
		console.log("1. SaveId");
		console.log("2. DeleteId");
		console.log("3. UpdateId");
		console.log("4. GetDomains");
		console.log("5. getIdForDomain");
		console.log("6. getPasswordForId");
		console.log("7. GetIds");
		console.log("8. DownloadAllDomains");
		console.log("9. CleanLocalDirectory");
		console.log("0. Exit");
		
		const rl = readline.createInterface({
	             input: process.stdin,
	             output: process.stdout,
	    });
	   	
	   	rl.question('\n Choice (1-9) ?', (choice) => {
	 		rl.close();
	 		console.log("your choice is :",choice);
	    	switch(choice)
	    	{
				case '1' :
						SaveId.saveId('yahoo.com','user1@yahoo.com','pass_yahoo_user1','master@123').then(result => {
						  console.log("Account created with ResultCode -",result);
						}).catch(e => {
						  console.log(e.message);
						});

						break;
				case '2' :
						DeleteId.deleteId('yahoo.com','user2@yahoo.com','master@123').then(result => {
						  console.log("Account delete with ResultCode -",result);
						}).catch(e => {
						  console.log(e);
						});

						break;
				case '3' :
						UpdateId.updateId('yahoo.com','user2@yahoo.com','pass_y_user2','master@123').then(result => {
						  console.log("Account updated with ResultCode -",result);
						}).catch(e => {
						  console.log(e);
						});

						break;
				case '4':
						GetDomains.getDoamins('master@123').then(result => {
						  for(var i = 0; i < result.length; ++i){
						    console.log(result[i]);
						  }
						}).catch(e => {
						  console.log(e.message);
						});

						break;
				case '5':
						GetIdForDomain.getIdForDomain('master@123','facebook.com').then(result => {
						  for(var i = 0; i < result.length; ++i){
						    console.log(result[i].domain,"\t",result[i].id,"\t",result[i].securityLevel);
						  }
						}).catch(e => {
						  console.log(e.message);
						});

						break;
				case '6':
						GetPasswordForId.getPasswordForId('master@123','facebook.com','user2@facebook.com').then(result => {
						    console.log(result);
						}).catch(e => {
						  console.log(e);
						});

						break;
				case '7':
						GetIds.getIds('master@123').then(result => {
						  for(var i = 0; i < result.length; ++i){
						    console.log(result[i].domain,"\t",result[i].id,"\t",result[i].password,"\t",result[i].securityLevel);
						  }
						}).catch(e => {
						  console.log(e.message);
						});				
						break;
				case '8':
						DownloadAllDomains.downloadAllDomains().then(result => {
						    console.log('DOWNLOADED ALL FILES!');
						}).catch(e => {
						  console.log(e.message);
						});

						break;
				case '9':
						CleanLocalDirectory.cleanLocalDirectory().then(() =>{
						   console.log('DELETED ALL FILES ')
						}).catch(e =>{
						    console.log(e);
						});

						break;
				case '0' :
						process.exit(0);
				default:
						console.log("Wrong choice!");
			}		
		});
	}).catch(e => {
		console.log(e.message);
	});
}).catch(e => {
  console.log(e.message);
});
