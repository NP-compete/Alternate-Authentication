/*
 * Developer: Shivam Gangwar
 * Maintainer: Shivam Gangwar
 * Date: 19 Feb 2019
 */

const fs = require('fs');
const nodePersist = require("node-persist");

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
    fs.unlinkSync(__dirname + '/gdriveCred/'+domainName)
  }catch(err) {
    throw new Error("Unable to delete the file from local directory!");
  }
}

module.exports = {
    cleanLocalDirectory
}