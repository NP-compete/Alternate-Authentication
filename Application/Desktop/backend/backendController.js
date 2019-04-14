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
const driveGetDomains = require('../../../Home/Gdrive/getDomains');
const driveGetPasswordForId = require('../../../Home/Gdrive/getPasswordForId');
const driveUpdateId = require('../../../Home/Gdrive/updateId');
const driveDeleteId = require('../../../Home/Gdrive/deleteId');
const driveGetIdForDomain = require('../../../Home/Gdrive/getIdForDomain');
const driveSaveId = require('../../../Home/Gdrive/saveId');

const blockchain = require('../../../Enterprise/BlockChain/passwordManager');

const masterPasswordKey = 'masterPassword';

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

async function getOnPremIds() {
  return onPremise.getIds(getMasterPassword());
}

async function getGoogleDriveIds() {
  // return await driveGetIds.getIds(getMasterPassword());
}

async function getTrustedDeviceIds() {
  return {};
}

async function getBlockchainIds() {
  return blockchain.getIds();
}

async function getIds() {
  let ids = await getOnPremIds();
  // ids = ids.concat(await getGoogleDriveIds());
  ids = ids.concat(await getBlockchainIds());
  return ids;
}

async function addId(domain, id, password, securityLevel) {
  console.log("add id called", domain, id, password, securityLevel);
  switch(securityLevel) {
    case 0:
      onPremise.saveId(domain, id, password, getMasterPassword());
      console.log("Saved");
      break;
    case 1:
      await driveSaveId.saveId(domain, id, password, getMasterPassword());
      console.log("Saved");
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

async function deleteId(domain, id, securityLevel) {
  console.log("Delete id called", domain, id, securityLevel);
  switch(securityLevel) {
    case 0:
      onPremise.deleteAccount(domain, id, getMasterPassword());
      console.log("Deleted");
      break;
    case 1:
      // await driveDeleteId.deleteId(domain, id, getMasterPassword());
      console.log("Deleted");
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
      onPremise.updateId(domain, id, pass, getMasterPassword());
      break;
    case 1:
      // await driveUpdateId.updateId(domain, id, pass, getMasterPassword());
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
      break;
    case 1:
      // return await driveGetPasswordForId.getPasswordForId(domain, id, getMasterPassword());
      break;
    case 2:
      break;
    case 3:
      return await blockchain.getPasswordForId(domain,id);
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
  console.log(passwordStrings);
  // var passwordString = JSON.parse(passwordStrings);
  for(var i in passwordStrings){
    passwordStrings[i].password = await getPasswordForId(passwordStrings[i].domain, passwordStrings[i].id, passwordStrings[i].securityLevel);
  }
  return passwordStrings;//get whole record, domain, password, id, security leve
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
  loginToGoogle
}

async function main() {
  // await addId('dummy1.com', 'alice@dummy1.com', '12345678', 0);
  // await addId('github.com', 'nandini8', '123456', 3);

  await blockchain.deleteId('github.com', 'nandini8');
  await blockchain.deleteId('www.facebook.com', 'nandini.soni8@gmail.com');


  console.log("saved to on Premise");
  // await addId('blockchainDomain1.com', 'account1@xyz.com', '56789', 3);
  // await addId('blockchainDomain2.com', 'account2@xyz.com', 'asdsd', 3);
  console.log("saved to bcd");
  // let ids = await getIds();
  // console.log(ids);
  var records = await getRecord();
  console.log(records);

}

// main();
