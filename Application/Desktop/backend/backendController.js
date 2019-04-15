const otpAuth = require('./OTP/otpAuth');
const constants = require('./OTP/constants');
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

const onPremise = require('../../../Home/OnPrem/onPremise');

const driveGetIds = require('../../../Home/Gdrive/getIds');
const driveCleanLocalDirectory = require('../../../Home/Gdrive/cleanLocalDirectory');
const driveDownloadAllDomains = require('../../../Home/Gdrive/downloadAllDomains');
const driveGetPasswordForId = require('../../../Home/Gdrive/getPasswordForId');
const driveUpdateId = require('../../../Home/Gdrive/updateId');
const driveDeleteId = require('../../../Home/Gdrive/deleteId');
const driveGetIdForDomain = require('../../../Home/Gdrive/getIdForDomain');
const driveSaveId = require('../../../Home/Gdrive/saveId');

const blockchain = require('../../../Enterprise/BlockChain/passwordManager');

const masterPasswordKey = 'masterPassword';

async function downloadAllDrive(){
  	driveDownloadAllDomains.downloadAllDomains();
}

async function requestOtp(phNo) {
  try {
    let result = await otpAuth.sendOtp(phNo);
    return result.auth_id;
  } catch(e) {
    throw e;
  }
}

async function verifyOtp(otp, authId) {
  try {
    let result = await otpAuth.verifyOtp(otp, authId);
    return result.flag == constants.responseFlags.ACTION_COMPLETE;
  } catch(e) {
    throw e;
  }
}

function getOnPremIds() {
  return onPremise.getIds('master@123');
}

async function getGoogleDriveIds() {
  try{
      return await driveGetIds.getIds('master@123');
  } catch(e) {
    throw e;
  }
}


async function getBlockchainIds() {
  return blockchain.getIds();
}

async function getIds() {
  let ids = [];
  ids = ids.concat(getOnPremIds());
  ids = ids.concat(await getGoogleDriveIds());
  ids = ids.concat(await getBlockchainIds());
  return ids;
}

async function addId(domain, id, password, securityLevel) {
  console.log("add id called", domain, id, password, securityLevel);
  switch(securityLevel) {
    case 0:
      onPremise.saveId(domain, id, password, 'master@123');
      console.log("Saved on onPremise");
      break;
    case 1:
      await driveSaveId.saveId(domain, id, password, 'master@123');
      console.log("Saved on Gdrive");
      break;
    case 2:
      break;
    case 3:
      console.log("before saving in bc");
      await blockchain.saveId(domain, id, password);
      console.log("Saved in blockchain");
      break;
    default:
  }
}

async function addThis(domain, id, securityLevel, oldSec){
  console.log("add this id called", domain, id, oldSec);
  var pass = await getPasswordForId(domain, id, oldSec);
  await deleteId(domain, id, parseInt(oldSec));
  console.log(pass);
  await addId(domain, id, pass, securityLevel);
  console.log("Done!!");
}

async function deleteId(domain, id, securityLevel) {
  console.log("Delete id called", domain, id, securityLevel);
  switch(securityLevel) {
    case 0:
      onPremise.deleteId(domain, id, 'master@123');
      console.log("Deleted");
      break;
    case 1:
      await driveDeleteId.deleteId(domain, id,'master@123');
      console.log("Deleted from gdrive");
      break;
    case 2:
      break;
    case 3:
      blockchain.deleteId(domain, id);
      console.log("Deleted");
      break;
    default:

  }
}

async function changePasswordForId(domain, id, pass, securityLevel) {
  switch(securityLevel) {
    case 0:
      onPremise.changePasswordForId(domain, id, pass, 'master@123');
      break;
    case 1:
      await driveUpdateId.updateId(domain, id, pass,'master@123');
      break;
    case 2:
      break;
    case 3:
      blockchain.saveId(domain, id, pass);
      break;
    default:
  }
}

async function getPasswordForId(domain, id, securityLevel) {
  switch(securityLevel) {
    case 0:
      return onPremise.getPasswordForId(domain, id, 'master@123');
      break;
    case 1:
      return await driveGetPasswordForId.getPasswordForId(domain, id, 'master@123');
      break;
    case 2:
      break;
    case 3:
      return await blockchain.getPasswordForId(domain,id)
      break;
    default:
  }
}



async function loginToGoogle() {

}

async function setMasterPassword(password) {
  localStorage.setItem(masterPasswordKey, password);

  blockchain.setMasterPassword(password);
}

async function getMasterPassword() {
  return 'master@123';//localStorage.getItem(masterPasswordKey);
}

async function getRecord() {
  let passwordStrings = await getIds();
  console.log("passwordStrings" , passwordStrings);
  for(var i in passwordStrings){
    passwordStrings[i].password = await getPasswordForId(passwordStrings[i].domain, passwordStrings[i].id, passwordStrings[i].securityLevel);
}
  return passwordStrings;//get whole record, domain, password, id, security leve//get whole record, domain, password, id, security leve
}

module.exports = {
  requestOtp,
  verifyOtp,
  addId,
  getIds,
  getPasswordForId,
  changePasswordForId,
  deleteId,
  getRecord,
  setMasterPassword,
  loginToGoogle,
  downloadAllDrive,
  addThis
}

async function main() {

  // await addId('app.pluralsight.com', 'nandini-soni', 'pass', 0)
  // console.log('saved to onprem');

  // await addId('www.facebook.com', 'nandini.soni8@gmail.com', 'pass', 1)
  // console.log("saved to gdrive");

  await addId('blockchainDomain1.com', 'account1@xyz.com', '56789', 0);
  await addId('blockchainDomain2.com', 'account2@xyz.com', 'asdsd', 0);
  await addId('www.github.com', 'nandini.soni8.com', '12345', 0);
  console.log("saved to bcd");


  // await addId('blockchainDomain1.com', 'account1@xyz.com', '56789', 3);
  // await addId('blockchainDomain2.com', 'account2@xyz.com', 'asdsd', 3);
  // await addId('www.github.com', 'nandini.soni8.com', '12345', 3);
  // console.log("saved to bcd");

  // let ids = await getIds();
  // console.log(ids);


  // await deleteId('app.pluralsight.com', 'nandini-soni', 0)
  // console.log('deleted from onprem');

  // await deleteId('www.facebook.com', 'nandini.soni8@gmail.com', 1)
  // console.log("deleted from gdrive");

  // // await deleteId('blockchainDomain1.com', 'account1@xyz.com', 3);
  // // await deleteId('blockchainDomain2.com', 'account2@xyz.com', 3);
  // await deleteId('www.github.com', 'nandini.soni8.com', 3);
  // console.log("deleted from bcd");

  ids = await getIds();
  // console.log(ids);

}
main();
