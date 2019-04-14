
const readline = require('readline');

const GetIds = require('./getIds');
const CleanLocalDirectory = require('./cleanLocalDirectory');
const DownloadAllDomains = require('./downloadAllDomains');
const GetPasswordForId = require('./getPasswordForId');
const UpdateId = require('./updateId');
const DeleteId = require('./deleteId');
const GetIdForDomain = require('./getIdForDomain');
const SaveId = require('./saveId');


DownloadAllDomains.downloadAllDomains().then(result => {
	console.clear();
	let d = '';
	GetIds1.getIds('master@123').then(result => {
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
		console.log("4. getIdForDomain");
		console.log("5. getPasswordForId");
		console.log("6. GetIds");
		console.log("7. DownloadAllDomains");
		console.log("8. CleanLocalDirectory");
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
						SaveId.saveId('facebook.com','user2@facebook.com','pass_f_user2','master@123').then(result => {
						  console.log("Account created with ResultCode -",result);
						}).catch(e => {
						  console.log(e.message);
						});

						break;
				case '2' :
						DeleteId.deleteId('facebook.com','user1@facebook.com','master@123').then(result => {
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
						GetIdForDomain.getIdForDomain('facebook.com', 'master@123').then(result => {
						  for(var i = 0; i < result.length; ++i){
						    console.log(result[i].domain,"\t",result[i].id,"\t",result[i].securityLevel);
						  }
						}).catch(e => {
						  console.log(e.message);
						});

						break;
				case '5':
						GetPasswordForId.getPasswordForId('facebook.com','user2@facebook.com','master@123').then(result => {
						    console.log(result);
						}).catch(e => {
						  console.log(e);
						});

						break;
				case '6':
						GetIds.getIds('master@123').then(result => {
						  for(var i = 0; i < result.length; ++i){
						    console.log(result[i].domain,"\t",result[i].id,"\t",result[i].password,"\t",result[i].securityLevel);
						  }
						}).catch(e => {
						  console.log(e.message);
						});
						break;
				case '7':
						DownloadAllDomains.downloadAllDomains().then(result => {
						    console.log('DOWNLOADED ALL FILES!');
						}).catch(e => {
						  console.log(e.message);
						});

						break;
				case '8':
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
