const BigchainDB = require('bigchaindb-driver')
const bip39 = require('bip39')
const Orm = require('bigchaindb-orm').default

const API_PATH = 'http://localhost:9984/api/v1/'

const ID = { phrase: "Galileo_SIH_2019" }

class DID extends Orm {
    constructor(entity) {
        super(API_PATH)
        this.entity = entity
    }
}

module.exports.AssetManager = class AssetManager {

    constructor(assetType) {
        this.seed = bip39.mnemonicToSeed(ID.phrase).slice(0, 32)
        this.userKeyPair = new BigchainDB.Ed25519Keypair(this.seed)

        this.conn = new BigchainDB.Connection(API_PATH, {})

        this.userDID = new DID(this.userKeyPair.publicKey)
        this.assetType = assetType;

        this.userDID.define(assetType, `https://schema.org/v1/${assetType}`)
    }

    async createAsset(data) {
        try {
            let asset = await this.userDID.models[this.assetType].create({
                keypair: this.userKeyPair,
                data: { 'ids': JSON.stringify(data) }
            });

            this.userDID.id = asset.id

            return asset;
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async retrieveAssets() {
        try {
            const retrieveAssets = await this.userDID.models[this.assetType].retrieve();
            return retrieveAssets[retrieveAssets.length - 1].data.ids;
        } catch (e) {
            return Promise.reject(e);
        }
    }

};
