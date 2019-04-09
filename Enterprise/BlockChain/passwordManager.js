const AssetManager = require('./assetManager.js').AssetManager;
const assetManager = new AssetManager('passModel');

/**
 * format
 * ------
 * data = { 'facebook.com;xyz.gmail.com': 'password_fb_xyz',
            'facebook.com;abc.gmail.com': 'password_fb_abc',
            'gmail.com;abc.gmail.com': 'password_gmail_abc' };
 */
async function saveId(domain, id, pass, masterPassword) {

  try {

    // var cipher = crypto.createCipher('aes-256-cbc', masterPassword);
    // var encryptedPass = cipher.update(pass, 'utf8', 'hex') + cipher.final('hex');


    let data = await assetManager.retrieveAssets();
    const key = domain+';'+id;
    data = JSON.parse(data);
    // data.ids[key] = encryptedPass;
    data.ids[key] = pass;

    await assetManager.createAsset(data);
  } catch(e) {

    // var cipher = crypto.createCipher('aes-256-cbc', masterPassword);
    // var encryptedPass = cipher.update(pass, 'utf8', 'hex') + cipher.final('hex');

    let ids = {};
    const key = domain+';'+id;
    // ids[key] = encryptedPass;
    ids[key] = pass;

    await assetManager.createAsset({
      masterPassword: 'default',
      ids
    });
  }

}

async function getStoredData() {
  try {
    let data = await assetManager.retrieveAssets();
    data = JSON.parse(data);

    return data.ids;
  } catch(e) {
    return {};
  }
}

async function getAllAccountDetails(masterPassword) {
  try {
    let ids = await getStoredData();
    ids = Object.keys(ids);
    let accountDetails = ids.map((id) => {
      let encryptedPassword = ids[id];
      // let cipher = crypto.createDecipher('aes-256-cbc', masterPassword);
      // let decryptedPassword = cipher.update(encryptedPassword, 'hex', 'utf8') + cipher.final('utf8');

      return {
        domain: ids.substring(0, input_string.indexOf(":")),
        id: ids.substring(input_string.indexOf(":")+1, ids.length),
        // password: decryptedPassword
        password: encryptedPassword
      };
    });
    return accountDetails;
  } catch(e) {
    return {};
  }
}

async function getPasswordForId(domain, id) {

  const key = domain+';'+id;

  try {
    let ids = await getStoredData();

    let encryptedPassword = ids[key];
    // let cipher = crypto.createDecipher('aes-256-cbc', masterPassword);
    // let decryptedPassword = cipher.update(encryptedPassword, 'hex', 'utf8') + cipher.final('utf8');

    // return decryptedPassword;
    return encryptedPassword;
  } catch(e) {
    return {};
  }
}

async function getIds() {
  try {
    let data = await getStoredData();
    ids = Object.keys(data);
    parsedIds = ids.map((id) => {
      return {
        domain: id.substring(0, id.indexOf(";")),
        id: id.substring(id.indexOf(";")+1, id.length),
        securityLevel: 3
      };
    });
    return parsedIds;
  } catch(e) {
    return {};
  }
}

async function getIdsForDomain(domain) {
  try {
    let ids = await getIds();

    return
  } catch(e) {
    return {};
  }
}

async function deleteId(domain, id) {

  try {
    let data = await assetManager.retrieveAssets();
    const key = domain+';'+id;
    data = JSON.parse(data);
    delete data.ids[key];

    await assetManager.createAsset(data);
  } catch(e) {
  }

}

async function setMasterPassword(masterPassword) {

  try {
    let data = await assetManager.retrieveAssets();
    data.masterPassword = password;

    await assetManager.createAsset(data);
  } catch(e) {

    await assetManager.createAsset({
      masterPassword: password,
      ids: {}
    });
  }
}

async function getMasterPassword() {
  try {
    let data = await assetManager.retrieveAssets();
    return data.masterPassword;
  } catch(e) {

    return "default";
  }
}


module.exports = {
  saveId,
  deleteId,
  getAllAccountDetails,
  getPasswordForId,
  getIds,
  getIdsForDomain,
  setMasterPassword,
  getMasterPassword
}

// async function main() {

//   await saveId('yahoo', 'xyz.yahoo.com', 'password2New');
//   let accDl = await getAllAccountDetails();
//   console.log(accDl);
//   let ids = await getIds();
//   console.log(ids);
// }

// main();
