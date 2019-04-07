const BigchainDB = require('bigchaindb-driver')
const bip39 = require('bip39')
const Orm = require('bigchaindb-orm').default

class DID extends Orm {
    constructor(entity) {
        super(API_PATH)
        this.entity = entity
    }
}

const seed = bip39.mnemonicToSeed('seedPhrase').slice(0, 32)
const alice = new BigchainDB.Ed25519Keypair(seed)

const API_PATH = 'https://test.bigchaindb.com/api/v1/'
const conn = new BigchainDB.Connection(API_PATH)

let userDID = new DID(alice.publicKey)

async function main() {
    userDID.define("myModel", "https://schema.org/v1/myModel")

    const ids = [{
        id: 'alice@xyz.com',
        password: 'password_xyz',
        domain: 'xyz'
    }, {
        id: 'aliceanother@xyz.com',
        password: 'password_abc',
        domain: 'xyz'
    }, {
        id: 'alice@gmail.com',
        password: 'password_gmail',
        domain: 'gmail'
    }];

    console.log("Creating Credentials...");
    let asset = await userDID.models.myModel.create({
        keypair: alice,
        data: { ids : ids }
    });
    userDID.id = asset.id
    console.log(`Transaction Created : ${asset.id}`);

    console.log("Retrieving Credentials...");
    let retrievedAssets = await userDID.models.myModel.retrieve(userDID.id);
    console.log('Retrieved Data: ')
    for(let asset of retrievedAssets) {
        console.log(JSON.stringify(asset.data.ids));
    }

    const updated_ids = [{
        id: 'alice@xyz.com',
        password: 'password_xyz_new',
        domain: 'xyz'
    }, {
        id: 'alice@gmail.com',
        password: 'password_gmail',
        domain: 'gmail'
    }, {
        id: 'alice@facebook.com',
        password: 'password_facebook',
        domain: 'facebook'
    }];

    console.log("Updating Credentials...");
    let updatedAssets = await retrievedAssets.concat({
        keypair: alice,
        data: { ids : updated_ids }
    })
    console.log('Updated Data: ')
    for(let asset of updatedAssets) {
        console.log(JSON.stringify(asset.data.ids));
    }


    // let retrievedAssets = await userDID.models.myModel.retrieve(asset.id);
    // console.log(JSON.stringify(retrievedAssets));
}

try {
    main();
} catch(e) {
    console.log(e);
}









/*





/////////////////////////////
const id_asset = {
    id: 'alice@xyz.com',
    company: 'xyz'
}

const password_metadata = {
    password: 'password',
    updated_on: new Date().toString()
}

const passwordAsset = BigchainDB.Transaction.makeCreateTransaction(
    {
        id_asset
    },
    password_metadata,
    [BigchainDB.Transaction.makeOutput(
        BigchainDB.Transaction.makeEd25519Condition(alice.publicKey))],
    alice.publicKey
);

const signedPasswordAsset = BigchainDB.Transaction.signTransaction(
    passwordAsset,
    alice.privateKey
)

conn.postTransactionCommit(signedPasswordAsset)
    .then(res => {
        console.log('Transaction Created!\nid : ' + signedPasswordAsset.id);
    })
    .then(res => {
        // Update Password

        const updated_password_metadata = {
            password: 'new_password',
            updated_on: new Date().toString()
        }

        transactionId = signedPasswordAsset.id;

        // conn.getTransaction(transactionId)
        // .then((txCreated) => {
        //     const createTranfer = BigchainDB.Transaction.
        //     makeTransferTransaction(
        //         // The output index 0 is the one that is being spent
        //         [{
        //             tx: txCreated,
        //             output_index: 0
        //         }],
        //         [BigchainDB.Transaction.makeOutput(
        //             BigchainDB.Transaction.makeEd25519Condition(
        //                 newOwner.publicKey))],
        //         {
        //             datetime: new Date().toString(),
        //             value: {
        //                 value_eur: '30000000€',
        //                 value_btc: '2100',
        //             }
        //         }
        //     )
        //     // Sign with the key of the owner of the painting (Alice)
        //     const signedTransfer = BigchainDB.Transaction
        //         .signTransaction(createTranfer, alice.privateKey)
        //     return conn.postTransactionCommit(signedTransfer)
        // })
        // .then(res => {
        //     document.body.innerHTML += '<h3>Transfer Transaction created</h3>'
        //     document.body.innerHTML += res.id
        // })
    })



*/