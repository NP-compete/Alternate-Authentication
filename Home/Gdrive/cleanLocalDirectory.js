/*
 * Developer: Shivam Gangwar
 * Maintainer: Shivam Gangwar
 * Date: 19 Feb 2019
 */

const fs = require('fs');
const storage = require("node-persist");
//allow for variable storage --> security feature
storage.initSync();



function cleanLocalDirectory(){
  return new Promise((resolve,reject) =>{
    try{
      let result  = storage.keys();
      for (var i = 0; i < result.length; i++) {
        if(result[i] !== 'token.json'){
            deleteDomain(result[i]);
        }
      }
      resolve();
  }catch(e){
    reject(e.message);
  }
  });
}

function deleteDomain(domainName){
  try{
    fs.unlinkSync('persist/'+domainName)
  }catch(err) {
    throw new Error("Unable to delete the file from local directory!");
  }
}



cleanLocalDirectory().then(() =>{
   console.log('DELETED ALL FILES ')
}).catch(e =>{
    console.log(e);
});
