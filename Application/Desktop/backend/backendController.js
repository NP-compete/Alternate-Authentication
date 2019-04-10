const otpAuth = require('./OTP/otpAuth');
const constants = require('./OTP/constants');
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

const onPremise = require('../../../Home/OnPrem/onPremise');
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
  return {};
}

async function getTrustedDeviceIds() {
  return {};
}

async function getBlockchainIds() {
  return blockchain.getIds();
}

async function getIds() {
  let ids = await getOnPremIds();
  ids = ids.concat(await getGoogleDriveIds());
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
      break;
    case 2:
      break;
    case 3:
      await blockchain.saveId(domain, id, password);
      console.log("Saved");
      break;
    default:
  }
}

async function deleteId(domain, id, securityLevel) {
  console.log("Delete id called", domain, id, securityLevel);
  switch(securityLevel) {
    case 0:
      onPremise.deleteAccount(domain, id);
      console.log("Deleted");
      break;
    case 1:
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
      onPremise.changePasswordForId(domain, id, pass, getMasterPassword());
      break;
    case 1:
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
  await addId('dummy.com', 'alice@dummy.com', '12345678', 0);
  console.log("saved to on Premise");
  await addId('blockchainDomain1.com', 'account1@xyz.com', '56789', 3);
  await addId('blockchainDomain2.com', 'account2@xyz.com', 'asdsd', 3);
  console.log("saved to bcd");
  // let ids = await getIds();
  // console.log(ids);
  var records = await getRecord();
  console.log(records);

}

// main();
